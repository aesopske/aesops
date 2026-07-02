import { tool } from 'ai'
import { z } from 'zod'
import {
    queryRows,
    aggregate,
    distinctValues,
    type DatasetQuery,
    type DatePart,
} from '@/lib/platform/dataset-query'

const filterSchema = z.object({
    column: z.string().describe('Exact column name to filter on'),
    op: z.enum(['eq', 'neq', 'contains', 'gt', 'gte', 'lt', 'lte', 'in']),
    value: z.string().describe('Value to compare against. Numbers should be passed as strings, e.g. "180".'),
})

function friendlyError(err: unknown): { error: string } {
    return { error: err instanceof Error ? err.message : 'Failed to read the dataset.' }
}

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
                'Return real rows from the dataset, optionally filtered by column conditions. Use for row-level lookups and listing specific entries. Returns up to `limit` rows plus the total number of matching rows.',
            parameters: z.object({
                filters: z
                    .array(filterSchema)
                    .optional()
                    .describe('Conditions combined with AND. Omit to return the first rows.'),
                columns: z
                    .array(z.string())
                    .optional()
                    .describe('Subset of columns to return. Omit for all columns.'),
                limit: z.number().int().min(0).max(100).optional().describe('Max rows to return (default 20). Pass 0 to return only the matched count with no rows.'),
            }),
            execute: async ({ filters, columns, limit }) => {
                try {
                    return queryRows(dq, { filters, columns, limit })
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),

        aggregate: tool({
            description:
                'Group the dataset by one or two columns and compute a metric per group. Use for exact counts ("how many X"), totals, averages, and medians — and to produce data for charts and tables. Pass an array of 2 columns for two-dimensional breakdowns (e.g. "by town AND by month", "per region per year"): the result key joins each column\'s value with " | " (e.g. "Nairobi | Sep"). Default metric is row count. Returns [{ key, value }] sorted descending (or chronologically for single-dimension month grouping).',
            parameters: z.object({
                groupBy: z
                    .union([z.string(), z.array(z.string()).min(1).max(2)])
                    .describe(
                        'Exact column name to group by. Pass an array of exactly 2 column names for a combined two-dimensional grouping (e.g. ["Town", "Date"]) — required whenever the question asks for a breakdown by two things at once, such as "compare X across towns for each month" or "show Y by region and by year". The result key for array form is "<value1> | <value2>", in the same order as the array. Never call aggregate once per combination and repeat a single value across rows/columns instead — always use the array form for genuine two-dimensional data.',
                    ),
                datePart: z
                    .enum(['year', 'month', 'month_year', 'quarter'])
                    .optional()
                    .describe('Extract a date part from the groupBy column(s) before grouping. Use "month" for Jan/Feb/…, "year" for 2024/2025, "month_year" for "Jan 2025", "quarter" for Q1 2025. Applies to every column named in groupBy — safe to pass even if only one of the two groupBy columns is a date; non-date columns pass through unchanged.'),
                metric: z
                    .object({
                        column: z.string().describe('Numeric column to aggregate.'),
                        fn: z.enum(['sum', 'avg', 'min', 'max', 'median']),
                    })
                    .optional()
                    .describe('Omit to count rows per group.'),
                rowFilters: z
                    .array(filterSchema)
                    .optional()
                    .describe('Filter rows before grouping (AND-combined). Use op "in" with a comma-separated value to match a list, e.g. "Nairobi,Mombasa,Nakuru".'),
                limit: z.number().int().min(0).max(5000).optional().describe('Max groups to return (default 20). Set higher for 2D groupBy or date columns with many unique values.'),
            }),
            execute: async ({ groupBy, datePart, metric, rowFilters, limit }) => {
                try {
                    return { groups: aggregate(dq, { groupBy, datePart: datePart as DatePart | undefined, metric, rowFilters, limit }) }
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
                limit: z.number().int().min(0).max(200).optional().describe('Max values to return (default 50). Pass 0 to return only the total count.'),
            }),
            execute: async ({ column, limit }) => {
                try {
                    return { values: distinctValues(dq, { column, limit }) }
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),
    }
}
