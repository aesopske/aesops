import { tool } from 'ai'
import { z } from 'zod'
import {
    queryRows,
    aggregate,
    distinctValues,
    type DatasetQuery,
    type DatePart,
} from '@/lib/platform/dataset-query'

const filterSchema = z
    .object({
        column: z.string().describe('Exact column name to filter on'),
        op: z.enum(['eq', 'neq', 'contains', 'gt', 'gte', 'lt', 'lte', 'in', 'is_null', 'is_not_null']),
        value: z
            .string()
            .optional()
            .describe(
                'Value to compare against. Numbers should be passed as strings, e.g. "180". Omit entirely for op "is_null" or "is_not_null" — those test for a blank/missing cell and take no value.',
            ),
    })
    .refine((f) => f.op === 'is_null' || f.op === 'is_not_null' || f.value !== undefined, {
        message: 'value is required unless op is "is_null" or "is_not_null"',
        path: ['value'],
    })

function friendlyError(err: unknown): { error: string } {
    return { error: err instanceof Error ? err.message : 'Failed to read the dataset.' }
}

// Prompt copy describing the tools above. Kept next to the definitions so the
// two can't drift apart; injected into any system prompt that passes these
// tools to the model.
export const DATASET_TOOLS_GUIDE = `You have tools that query the full dataset on demand:
- think — call this FIRST for any question involving time periods, multi-step reasoning, or combined filters. Write your plan before calling data tools.
- aggregate — group by one or two columns (pass an array for two, e.g. ["Town","Date"]) and count/sum/avg/min/max/median. Omit groupBy entirely for a single overall total or average with no breakdown (e.g. "total population of Uganda" → rowFilters:[{column:"Country",op:"eq",value:"Uganda"}], metric:{column:"Population",fn:"sum"}, no groupBy). Supports datePart ("year", "month", "month_year", "quarter") to extract date parts from a date column. Use rowFilters to pre-filter rows (e.g. year=2025) before grouping.
- query_rows — fetch real rows with optional filters and sorting. Use for row-level lookups, listing specific entries, and finding the first/last row (orderBy + limit:1) — e.g. the earliest and latest values for a growth-rate or ROI calculation.
- distinct_values — list the unique values of a column with counts, beyond the few shown above.

IMPORTANT: The tool names above (think, aggregate, query_rows, distinct_values) are internal implementation details. NEVER mention them in your responses. When you hit a limitation, describe it in plain user-facing language only. BAD: "the aggregate function doesn't support median". GOOD: "I can't compute the median directly from this dataset".`

// Tools are bound per-request to a DatasetQuery (DuckDB over the dataset's
// Parquet) so the model never passes a storage key and each call runs only the
// slice it needs.
export function buildDatasetTools(dq: DatasetQuery) {
    return {
        think: tool({
            description:
                'Use this tool FIRST for any question that involves time periods, multiple steps, or combining filters with aggregations. Write your plan — which columns to use, which tools to call, and in what order — before calling any data tool.',
            parameters: z.object({
                plan: z.string().describe('Step-by-step plan for answering the question, including column names and tool sequence.'),
            }),
            execute: async ({ plan }) => ({ ok: true, plan }),
        }),

        query_rows: tool({
            description:
                'Return real rows from the dataset, optionally filtered and sorted. Use for row-level lookups, listing specific entries, and finding the first/last (earliest/latest by date, or highest/lowest by a numeric column) — sort with orderBy and pass limit:1. Rows are capped at 100 per call regardless of the limit passed; the response always includes the true total matched count. Never request a large limit to fetch most/all of a dataset — use orderBy + a small limit, or aggregate, instead.',
            parameters: z.object({
                filters: z
                    .array(filterSchema)
                    .optional()
                    .describe('Conditions combined with AND. Omit to return the first rows.'),
                columns: z
                    .array(z.string())
                    .optional()
                    .describe('Subset of columns to return. Omit for all columns.'),
                orderBy: z
                    .object({
                        column: z.string().describe('Exact column name to sort by.'),
                        direction: z
                            .enum(['asc', 'desc'])
                            .optional()
                            .describe('Sort direction (default asc). Use "asc" for earliest/first/lowest, "desc" for latest/last/highest.'),
                    })
                    .optional()
                    .describe('Sort before applying limit. Combine with limit:1 to fetch a single endpoint row — e.g. the earliest and latest rows for a growth-rate or ROI calculation.'),
                limit: z.number().int().min(0).optional().describe('Max rows to return (default 20, hard-capped at 100). Pass 0 to return only the matched count with no rows.'),
            }),
            execute: async ({ filters, columns, orderBy, limit }) => {
                try {
                    return await queryRows(dq, { filters, columns, orderBy, limit })
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),

        aggregate: tool({
            description:
                'Group the dataset by one or two columns and compute a metric per group. Use for exact counts ("how many X"), totals, averages, and medians — and to produce data for charts and tables. Pass an array of 2 columns for two-dimensional breakdowns (e.g. "by town AND by month", "per region per year"): the result key joins each column\'s value with " | " (e.g. "Nairobi | Sep"). Default metric is row count. Omit groupBy for a single grand-total row (use rowFilters to scope it, e.g. by country) — returns [{ key: "Total", value }]. Returns [{ key, value }] sorted descending (or chronologically for single-dimension month grouping).',
            parameters: z.object({
                groupBy: z
                    .union([z.string(), z.array(z.string()).max(2)])
                    .optional()
                    .describe(
                        'Exact column name(s) to group by. Omit entirely for a single grand-total value with no breakdown (e.g. "total population of Uganda", "average X overall") — combine with rowFilters to scope it (e.g. rowFilters:[{column:"Country",op:"eq",value:"Uganda"}]). Pass an array of exactly 2 column names for a combined two-dimensional grouping (e.g. ["Town", "Date"]) — required whenever the question asks for a breakdown by two things at once, such as "compare X across towns for each month" or "show Y by region and by year". The result key for array form is "<value1> | <value2>", in the same order as the array. Never call aggregate once per combination and repeat a single value across rows/columns instead — always use the array form for genuine two-dimensional data.',
                    ),
                datePart: z
                    .enum(['year', 'month', 'month_year', 'quarter'])
                    .optional()
                    .describe('Extract a date part from the groupBy column(s) before grouping. Use "month" for Jan/Feb/…, "year" for 2024/2025, "month_year" for "Jan 2025", "quarter" for Q1 2025. Applies to every column named in groupBy — safe to pass even if only one of the two groupBy columns is a date; non-date columns pass through unchanged.'),
                metric: z
                    .object({
                        column: z.string().optional().describe('Numeric column to aggregate. Not needed when fn is "count".'),
                        fn: z.enum(['count', 'sum', 'avg', 'min', 'max', 'median']),
                    })
                    .optional()
                    .describe('Omit entirely (or pass fn:"count") to count rows per group.'),
                rowFilters: z
                    .array(filterSchema)
                    .optional()
                    .describe('Filter rows before grouping (AND-combined). Use op "in" with a comma-separated value to match a list, e.g. "Nairobi,Mombasa,Nakuru".'),
                limit: z.number().int().min(0).optional().describe('Max groups to return (default 20, hard-capped at 5000). Set higher for 2D groupBy or date columns with many unique values.'),
            }),
            execute: async ({ groupBy, datePart, metric, rowFilters, limit }) => {
                try {
                    // `fn: 'count'` and omitting `metric` both mean "count rows per
                    // group" — `aggregate()` only accepts the latter.
                    if (metric && metric.fn !== 'count' && !metric.column) {
                        return { error: `metric.column is required when fn is "${metric.fn}"` }
                    }
                    const resolvedMetric =
                        !metric || metric.fn === 'count'
                            ? undefined
                            : { column: metric.column!, fn: metric.fn }
                    return {
                        groups: await aggregate(dq, {
                            groupBy,
                            datePart: datePart as DatePart | undefined,
                            metric: resolvedMetric,
                            rowFilters,
                            limit,
                        }),
                    }
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),

        distinct_values: tool({
            description:
                'List the unique values of a column with their counts (beyond the top few in the schema summary). Use to discover what values exist before filtering.',
            parameters: z.object({
                column: z.string().describe('Exact column name.'),
                limit: z.number().int().min(0).optional().describe('Max values to return (default 50, hard-capped at 200). Pass 0 to return only the total count.'),
            }),
            execute: async ({ column, limit }) => {
                try {
                    return { values: await distinctValues(dq, { column, limit }) }
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),
    }
}
