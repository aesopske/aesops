import { aiUsageEvents, db } from '@repo/db'
import { logger } from './logger'

type TokenUsage = {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
}

type RecordAiUsageInput = {
    route: string
    model: string
    userId?: string | null
    latencyMs: number
    success: boolean
    usage?: TokenUsage
    errorMessage?: string
}

function toFiniteOrNull(value: number | undefined | null) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function recordAiUsage(input: RecordAiUsageInput) {
    db.insert(aiUsageEvents)
        .values({
            route: input.route,
            model: input.model,
            userId: input.userId ?? null,
            promptTokens: toFiniteOrNull(input.usage?.promptTokens),
            completionTokens: toFiniteOrNull(input.usage?.completionTokens),
            totalTokens: toFiniteOrNull(input.usage?.totalTokens),
            latencyMs: input.latencyMs,
            success: input.success,
            errorMessage: input.errorMessage ?? null,
        })
        .catch((err) => logger.error(input.route, 'failed to record ai usage event', { err: String(err) }))
}
