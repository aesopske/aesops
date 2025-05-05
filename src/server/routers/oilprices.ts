import { z } from 'zod'
import { toSentenceCase } from '@src/lib/utils'
import { createTRPCRouter, publicProcedure } from '../trpc'

const avgMonthlyPricesSchema = z
    .object({
        filters: z
            .object({
                oiltype: z
                    .union([
                        z.literal('Pms'),
                        z.literal('Dpk'),
                        z.literal('Ago'),
                    ])
                    .optional(),
                towns: z.array(z.string()).default([]),
                years: z.array(z.string()).default([]),
            })
            .optional(),
    })
    .optional()

const avgPricesSchema = z
    .object({
        filters: z
            .object({
                year: z.string().optional(),
            })
            .optional(),
    })
    .optional()

const removePrefix = (str: string, prefix: string) => {
    if (str.startsWith(prefix)) {
        return str.replace(new RegExp(`^${prefix}:`, 'i'), '')
    }
    return str
}

const monthOrder = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

export const oilPricesRouter = createTRPCRouter({
    getDatasetPreview: publicProcedure.query(async ({ ctx }) => {
        const oilPrices = await ctx.db.oil_prices.findMany({
            take: 20,
        })

        const columns = Object.keys(oilPrices[0]).map((key) => ({
            label: key.toUpperCase(),
            value: key,
        }))
        return {
            title: 'Oil Prices Data Preview',
            description: 'Preview of the oil prices dataset',
            data: oilPrices,
            columns: columns,
            type: 'table',
        }
    }),
    getOilPrices: publicProcedure.query(async ({ ctx }) => {
        const oilPrices = await ctx.db.oil_prices.findMany({ take: 5 })
        return oilPrices
    }),
    avgMonthlyPrices: publicProcedure
        .input(avgMonthlyPricesSchema)
        .query(async ({ input, ctx }) => {
            const { towns, oiltype, years } = input?.filters ?? {}
            const filterPrefix = 'avg_town'

            const defaultValues = {
                towns: ['NAIROBI', 'MOMBASA', 'KISUMU'],
                oilType: 'Pms',
                years: [
                    String(new Date().getFullYear() - 1),
                    String(new Date().getFullYear()),
                ],
            }

            // Clean the filters
            const selectedYears =
                years && years.length > 0
                    ? years?.map((year) => removePrefix(year, filterPrefix))
                    : defaultValues.years
            const selectedOilType = oiltype
                ? removePrefix(oiltype ?? '', filterPrefix)
                : defaultValues.oilType
            const townsList =
                towns && towns.length > 0
                    ? towns?.map((town) => removePrefix(town, filterPrefix))
                    : defaultValues.towns

            // get the distinct years
            const allYears = await ctx.db.oil_prices.findMany({
                distinct: ['Year'],
                select: {
                    Year: true,
                },
                orderBy: { Year: 'asc' },
            })

            const yearsList = allYears.map((yr) => ({
                label: String(yr.Year),
                value: String(yr.Year),
            }))

            // Major counties
            const majorTowns = [
                'NAIROBI',
                'KISUMU',
                'MOMBASA',
                'NAKURU',
                'ELDORET',
            ].map((twn) => ({
                label: twn,
                value: twn,
            }))

            // Oil types in the database
            const oilTypes = ['Pms', 'Ago', 'Dpk'].map((type) => ({
                label: type.toUpperCase(),
                value: type,
            }))

            // Query & aggregate the data from the database
            const aggregatedData = await ctx.db.oil_prices.groupBy({
                by: ['Month', 'Towns'],
                _avg: {
                    [selectedOilType]: true,
                },
                where: {
                    Year: {
                        in: selectedYears.map((yr) => parseInt(yr)),
                    },
                    Towns: {
                        in: townsList.map((county) => county.toUpperCase()),
                    },
                },
            })

            // order the data by month
            aggregatedData.sort(
                (a, b) =>
                    monthOrder.indexOf(a.Month ?? '') -
                    monthOrder.indexOf(b.Month ?? ''),
            )

            // Pivot the data
            type PivotRow = {
                Month: string
                oilType: string
                [key: string]: number | string
            }

            const pivotMap: Record<string, PivotRow> = {}
            aggregatedData.forEach((row) => {
                const month = row?.Month?.substring(0, 3) ?? ''
                const townKey = row.Towns?.toUpperCase() ?? ''
                const avgValue = row._avg[selectedOilType] as number

                if (!pivotMap[month]) {
                    pivotMap[month] = { Month: month, oilType: selectedOilType }
                }

                pivotMap[month][townKey] = parseFloat(avgValue?.toFixed(2) ?? 0)
            })

            const pivotedData = Object.values(pivotMap)

            let description = `Average ${selectedOilType.toUpperCase()} prices for the year ${selectedYears[0]} in ${townsList.map((county) => toSentenceCase(county)).join(', ')}`

            if (selectedYears.length > 1) {
                description = `Average ${selectedOilType.toUpperCase()} prices for the years ${selectedYears.join(', ')} in ${townsList.map((county) => toSentenceCase(county)).join(', ')}`
            }

            const filters = [
                {
                    label: 'oiltype',
                    type: 'select',
                    data: oilTypes,
                    initialValue: selectedOilType,
                },
                {
                    label: 'towns',
                    type: 'multi-select',
                    placeholder: 'Towns',
                    data: majorTowns,
                    initialValue: townsList,
                },
                {
                    label: 'years',
                    type: 'multi-select',
                    placeholder: 'Years',
                    data: yearsList,
                    initialValue: selectedYears,
                },
            ]

            return {
                title: 'Average monthly fuel prices in major towns',
                description: description,
                columns: townsList.map((town) => town.toUpperCase()),
                data: pivotedData,
                filters: filters,
                type: 'lineChart',
                XAxisKey: 'Month',
                filterPrefix,
            }
        }),

    getAveragePrices: publicProcedure
        .input(avgPricesSchema)
        .query(async ({ input, ctx }) => {
            const filterPrefix = 'avg_fuel'

            const selectedYear = input?.filters?.year
                ? parseInt(
                      removePrefix(input?.filters?.year ?? '', filterPrefix),
                  )
                : null

            // get the distinct years
            const allYears = await ctx.db.oil_prices.findMany({
                distinct: ['Year'],
                select: {
                    Year: true,
                },
                orderBy: { Year: 'asc' },
            })

            const yearsList = allYears.map((yr) => ({
                label: String(yr.Year),
                value: String(yr.Year),
            }))

            const numericCols = ['Pms', 'Dpk', 'Ago', 'Ppb', 'Exrates']

            const data = await ctx.db.oil_prices.groupBy({
                by: selectedYear ? ['Month'] : ['Year'],
                where: {
                    Year: selectedYear ? { equals: selectedYear } : undefined,
                },
                orderBy: selectedYear ? { Month: 'asc' } : { Year: 'asc' },
                _avg: {
                    Pms: true,
                    Dpk: true,
                    Ago: true,
                    Ppb: true,
                    Exrates: true,
                },
            })

            if (selectedYear) {
                // sort the data by month
                data.sort(
                    (a, b) =>
                        monthOrder.indexOf(a.Month ?? '') -
                        monthOrder.indexOf(b.Month ?? ''),
                )
            }

            // format the data to remove all numeric values from the _avg object
            const formattedData = data.map((row) => {
                const { _avg, ...rest } = row

                if (rest?.Month) {
                    rest.Month = rest.Month.substring(0, 3)
                }
                return { ...rest, ..._avg }
            })

            const filters = [
                {
                    label: 'year',
                    type: 'select',
                    placeholder: 'Year',
                    data: yearsList,
                    initialValue: selectedYear ? selectedYear : undefined,
                },
            ]

            let description = `Average ${numericCols.join(', ')} for the each year`
            if (selectedYear) {
                description = `Average ${numericCols.join(', ')} for the year ${selectedYear}`
            }

            return {
                title: 'Average Fuel Prices incl. Exchange rates & Prices per barrel',
                description: description,
                columns: numericCols,
                data: formattedData,
                filters: filters,
                type: 'lineChart',
                XAxisKey: selectedYear ? 'Month' : 'Year',
                filterPrefix,
            }
        }),

    getPredictions: publicProcedure.query(async ({ ctx }) => {
        const predictions = await ctx.db.predictions.findMany({
            orderBy: { prediction_date: 'desc' },
            take: 3,
            select: {
                month: true,
                PMS: true,
                AGO: true,
                DPK: true,
            },
        })

        const columns = Object.keys(predictions[0]).map((key) => ({
            label: key.toUpperCase(),
            value: key,
        }))

        // Format the currency values
        const formattedPredictions = predictions.map((pred) => {
            const KSHCurrency = new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'KES',
            })

            return {
                ...pred,
                PMS: KSHCurrency.format(pred.PMS ?? 0),
                AGO: KSHCurrency.format(pred.AGO ?? 0),
                DPK: KSHCurrency.format(pred.DPK ?? 0),
            }
        })

        return {
            title: 'Fuel Prices Prediction',
            description: 'Predicted fuel prices for the next 3 months',
            data: formattedPredictions,
            columns: columns,
            type: 'table',
        }
    }),
})
