'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import React, { Fragment } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
} from '@/components/ui/chart'

interface AesLinesProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description: string
    data: Record<string, any>[]
    XAxisKey: string
    config: ChartConfig
    renderFooter?: React.ReactNode | null
    renderFilters?: React.ReactNode | null
}

function AesLines({
    data,
    title,
    config,
    XAxisKey,
    description,
    renderFooter,
    renderFilters,
    ...props
}: AesLinesProps) {
    // check that the data and config are valid and return null if not
    if (!data || !config) {
        return null
    }

    return (
        <Card className={props.className}>
            <CardHeader className='px-3 md:px-6'>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className='px-3 md:px-6'>
                <div>{renderFilters ? renderFilters : null}</div>
                <ChartContainer config={config}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}>
                        <CartesianGrid vertical={false} />
                        {XAxisKey ? (
                            <XAxis
                                height={45}
                                tickMargin={8}
                                tickLine={false}
                                axisLine={false}
                                dataKey={XAxisKey}
                                tickFormatter={(value) => value}
                            />
                        ) : null}
                        <YAxis width={20} tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        {Object.keys(config).map((key) => (
                            <Fragment key={key}>
                                <Line
                                    dataKey={key}
                                    type='monotone'
                                    stroke={config[key].color}
                                    strokeWidth={2}
                                    dot={{
                                        fill: config[key].color,
                                        strokeWidth: 0,
                                    }}
                                />
                            </Fragment>
                        ))}

                        <ChartLegend className='mt-4' />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            {renderFooter ? <CardFooter>{renderFooter}</CardFooter> : null}
        </Card>
    )
}

export default AesLines
