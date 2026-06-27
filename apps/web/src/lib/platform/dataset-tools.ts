import { tool } from 'ai'
import { z } from 'zod'
import {
    loadRows,
    queryRows,
    aggregate,
    distinctValues,
    DatasetTooLargeError,
    type QueryableDoc,
    type DatePart,
} from '@/lib/platform/dataset-query'

const filterSchema = z.object({
    column: z.string().describe('Exact column name to filter on'),
    op: z.enum(['eq', 'neq', 'contains', 'gt', 'gte', 'lt', 'lte', 'in']),
    value: z.string().describe('Value to compare against. Numbers should be passed as strings, e.g. "180".'),
})

function friendlyError(err: unknown): { error: string } {
    if (err instanceof DatasetTooLargeError) {
        return {
            error: 'This dataset is too large to query inline. Answer from the column statistics and sample rows instead.',
        }
    }
    return { error: err instanceof Error ? err.message : 'Failed to read the dataset.' }
}

// Tools are bound per-request to the resolved doc so the model never passes a
// storage key and can only query the dataset in scope.
export function buildDatasetTools(doc: QueryableDoc) {
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
                    const rows = await loadRows(doc)
                    return queryRows(rows, { filters, columns, limit })
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),

        aggregate: tool({
            description:
                'Group the dataset by a column and compute a metric per group. Use for exact counts ("how many X"), totals, and averages — and to produce data for charts. Default metric is row count. Returns [{ key, value }] sorted descending.',
            parameters: z.object({
                groupBy: z.string().describe('Exact column name to group by.'),
                datePart: z
                    .enum(['year', 'month', 'month_year', 'quarter'])
                    .optional()
                    .describe('Extract a date part from the groupBy column before grouping. Use "month" for Jan/Feb/…, "year" for 2024/2025, "month_year" for "Jan 2025", "quarter" for Q1 2025. Requires groupBy to be a date column.'),
                metric: z
                    .object({
                        column: z.string().describe('Numeric column to aggregate.'),
                        fn: z.enum(['sum', 'avg', 'min', 'max']),
                    })
                    .optional()
                    .describe('Omit to count rows per group.'),
                rowFilters: z
                    .array(filterSchema)
                    .optional()
                    .describe('Filter rows before grouping (AND-combined). Use op "in" with a comma-separated value to match a list, e.g. "Nairobi,Mombasa,Nakuru".'),
                limit: z.number().int().min(0).max(5000).optional().describe('Max groups to return (default 20). Set higher for date columns with many unique values.'),
            }),
            execute: async ({ groupBy, datePart, metric, rowFilters, limit }) => {
                try {
                    const rows = await loadRows(doc)
                    return { groups: aggregate(rows, { groupBy, datePart: datePart as DatePart | undefined, metric, rowFilters, limit }) }
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
                    const rows = await loadRows(doc)
                    return { values: distinctValues(rows, { column, limit }) }
                } catch (err) {
                    return friendlyError(err)
                }
            },
        }),
    }
}
