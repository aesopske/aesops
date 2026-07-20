'use client'

import { useSyncExternalStore } from 'react'

export type PinnedMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
    pinnedAt: number
}

const STORAGE_PREFIX = 'aesops:pinned-messages:'
const PIN_LIMIT = 3
const CHANGE_EVENT = 'pinned-messages-changed'
const EMPTY: PinnedMessage[] = []

function storageKey(datasetId: string) {
    return `${STORAGE_PREFIX}${datasetId}`
}

const cache = new Map<string, { raw: string | null; snapshot: PinnedMessage[] }>()

function readStorage(datasetId: string): PinnedMessage[] {
    if (typeof window === 'undefined') return EMPTY
    const raw = window.localStorage.getItem(storageKey(datasetId))
    const cached = cache.get(datasetId)
    if (cached && cached.raw === raw) return cached.snapshot
    let snapshot: PinnedMessage[] = EMPTY
    try {
        const parsed = raw ? JSON.parse(raw) : []
        snapshot = Array.isArray(parsed) ? parsed : EMPTY
    } catch {
        snapshot = EMPTY
    }
    cache.set(datasetId, { raw, snapshot })
    return snapshot
}

function writeStorage(datasetId: string, messages: PinnedMessage[]) {
    window.localStorage.setItem(storageKey(datasetId), JSON.stringify(messages))
    window.dispatchEvent(new Event(CHANGE_EVENT))
}

function getPinnedMessages(datasetId: string): PinnedMessage[] {
    return readStorage(datasetId)
}

export function pinMessage(
    datasetId: string,
    entry: Omit<PinnedMessage, 'pinnedAt'>,
): boolean {
    const current = readStorage(datasetId)
    if (current.some((m) => m.id === entry.id)) return true
    if (current.length >= PIN_LIMIT) return false
    writeStorage(datasetId, [...current, { ...entry, pinnedAt: Date.now() }])
    return true
}

export function unpinMessage(datasetId: string, messageId: string) {
    const current = readStorage(datasetId)
    writeStorage(
        datasetId,
        current.filter((m) => m.id !== messageId),
    )
}

function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback)
    window.addEventListener('storage', callback)
    return () => {
        window.removeEventListener(CHANGE_EVENT, callback)
        window.removeEventListener('storage', callback)
    }
}

export function usePinnedMessages(datasetId: string): PinnedMessage[] {
    return useSyncExternalStore(
        subscribe,
        () => getPinnedMessages(datasetId),
        () => EMPTY,
    )
}

export const PINNED_MESSAGES_LIMIT = PIN_LIMIT
