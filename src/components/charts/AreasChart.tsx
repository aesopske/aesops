'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import React from 'react'
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
    ChartLegendContent,
} from '@/components/ui/chart'

interface AesAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description: string
    data: any[]
    XAxisKey: string
    config: ChartConfig
    renderFooter?: React.ReactNode | null
    renderFilters?: React.ReactNode | null
}

function AesArea({
    data,
    title,
    config,
    XAxisKey,
    description,
    renderFooter,
    renderFilters,
    ...props
}: AesAreaProps) {
    // check that the data and config are valid and return null if not
    if (!data || !config) {
        return null
    }

    return (
        <Card className={props.className}>
            <CardHeader className='px-3 md:px-6'>
                <CardTitle className='font-sans text-lg lg:text-2xl '>
                    {title}
                </CardTitle>
                <CardDescription className='font-sans'>
                    {description}
                </CardDescription>
                <div>{renderFilters ? renderFilters : null}</div>
            </CardHeader>
            <CardContent className='px-3 md:px-6'>
                <ChartContainer config={config}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        height={500}
                        width={800}
                        margin={{
                            left: 12,
                            right: 12,
                        }}>
                        <CartesianGrid
                            vertical={true}
                            horizontal={true}
                            strokeDasharray='4 4'
                            strokeDashoffset='0'
                        />
                        {XAxisKey ? (
                            <XAxis
                                height={45}
                                tickMargin={8}
                                tickLine={false}
                                axisLine={false}
                                dataKey={XAxisKey}
                                tickFormatter={(value) => value}
                                label={{ value: XAxisKey, position: 'bottom' }}
                            />
                        ) : null}
                        <YAxis
                            width={20}
                            tickLine={true}
                            axisLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => {
                                if (typeof value === 'number') {
                                    // make it 2 decimal places
                                    return value.toFixed(0)
                                }
                                return value
                            }}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent />}
                        />

                        {Object.keys(config).map((key) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type='natural'
                                strokeDasharray='4 4'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeDashoffset='0'
                                strokeWidth={2}
                                dot={{
                                    fill: config[key].color,
                                    strokeWidth: 0,
                                }}
                                fill={config[key].color}
                                fillOpacity={0.4}
                                stroke={config[key].color}
                                stackId='a'
                            />
                        ))}

                        <ChartLegend
                            className='mt-4'
                            content={<ChartLegendContent />}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {renderFooter ? <CardFooter>{renderFooter}</CardFooter> : null}
        </Card>
    )
}

export default AesArea
