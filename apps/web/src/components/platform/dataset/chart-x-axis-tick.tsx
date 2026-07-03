'use client'

import { TICK_STYLE } from '@/lib/platform/chart-theme'

const MAX_CHARS_PER_LINE = 6
const MAX_LINES = 2
const LINE_HEIGHT = 12

function wrapLabel(value: string, maxCharsPerLine = MAX_CHARS_PER_LINE, maxLines = MAX_LINES): string[] {
    const words = value.split(' ')
    const lines: string[] = []
    let current = ''

    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word
        if (candidate.length > maxCharsPerLine && current) {
            lines.push(current)
            current = word
        } else {
            current = candidate
        }
    }
    if (current) lines.push(current)

    if (lines.length <= maxLines) return lines

    const visible = lines.slice(0, maxLines)
    const last = visible[maxLines - 1]!
    visible[maxLines - 1] =
        last.length > maxCharsPerLine - 1 ? `${last.slice(0, maxCharsPerLine - 1)}…` : `${last}…`
    return visible
}

type Props = {
    x?: number
    y?: number
    payload?: { value: string }
    index?: number
    totalCount?: number
}

export function ChartXAxisTick({ x, y, payload, index, totalCount }: Props) {
    if (x === undefined || y === undefined || !payload) return null

    const lines = wrapLabel(String(payload.value))

    // Anchor edge ticks away from the chart bounds so they don't get clipped
    const isFirst = index === 0
    const isLast = totalCount !== undefined && index === totalCount - 1
    const textAnchor = isFirst ? 'start' : isLast ? 'end' : 'middle'

    return (
        <text x={x} y={y} textAnchor={textAnchor} fill={TICK_STYLE.fill} fontSize={TICK_STYLE.fontSize}>
            {lines.map((line, i) => (
                <tspan key={i} x={x} dy={i === 0 ? 12 : LINE_HEIGHT}>
                    {line}
                </tspan>
            ))}
        </text>
    )
}
