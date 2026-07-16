import { C } from './chart-theme'

// Route identifiers as passed to `recordAiUsage` (see lib/platform/ai-usage.ts).
// Fixed order — used to assign categorical chart colors so a route's color
// never changes when other routes are filtered in/out.
export const AI_ROUTE_ORDER = [
    'ai/chat',
    'ai/comment-reply',
    'ai/insights',
    'completion',
] as const

const AI_ROUTE_LABELS: Record<string, string> = {
    'ai/chat': 'Dataset chat',
    'ai/comment-reply': '@aisops replies',
    'ai/insights': 'Dataset insights',
    completion: 'Text completion',
}

// Fixed route → color assignment (never reassigned by position in a filtered list).
const AI_ROUTE_COLORS: Record<string, string> = {
    'ai/chat': C.c1,
    'ai/comment-reply': C.c2,
    'ai/insights': C.c3,
    completion: C.c4,
}

export function aiRouteLabel(route: string): string {
    return AI_ROUTE_LABELS[route] ?? route
}

export function aiRouteColor(route: string): string {
    return AI_ROUTE_COLORS[route] ?? C.c5
}
