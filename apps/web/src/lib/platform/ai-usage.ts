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

export function recordAiUsage(input: RecordAiUsageInput) {
    db.insert(aiUsageEvents)
        .values({
            route: input.route,
            model: input.model,
            userId: input.userId ?? null,
            promptTokens: input.usage?.promptTokens ?? null,
            completionTokens: input.usage?.completionTokens ?? null,
            totalTokens: input.usage?.totalTokens ?? null,
            latencyMs: input.latencyMs,
            success: input.success,
            errorMessage: input.errorMessage ?? null,
        })
        .catch((err) => logger.error(input.route, 'failed to record ai usage event', { err: String(err) }))
}
