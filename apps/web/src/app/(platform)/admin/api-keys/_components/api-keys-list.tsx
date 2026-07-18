'use client'

import { useState } from 'react'
import { Check, Copy, KeyRound, X } from 'lucide-react'
import { trpc } from '@/trpc/react'
import { timeAgo } from '@/lib/platform/format'

type ApiKeyRow = {
    id: string
    name: string | null
    start: string | null
    prefix: string | null
    enabled: boolean
    createdAt: Date
    lastRequest: Date | null
}

function CreatedKeyBanner({ apiKey, onDismiss }: { apiKey: string; onDismiss: () => void }) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        await navigator.clipboard.writeText(apiKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className='mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4'>
            <p className='text-sm font-medium text-foreground'>
                Copy this key now — it won&apos;t be shown again.
            </p>
            <div className='mt-2 flex items-center gap-2'>
                <code className='flex-1 truncate rounded-lg bg-card px-3 py-2 text-xs text-foreground'>
                    {apiKey}
                </code>
                <button
                    onClick={copy}
                    className='flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary'
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                    onClick={onDismiss}
                    className='shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground'
                    aria-label='Dismiss'
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}

function ApiKeySkeletonRow() {
    return (
        <li className='flex animate-pulse items-center gap-3 px-4 py-3.5'>
            <div className='h-9 w-9 shrink-0 rounded-lg bg-muted' />
            <div className='min-w-0 flex-1 space-y-1.5'>
                <div className='h-3.5 w-32 rounded bg-muted' />
                <div className='h-3 w-48 rounded bg-muted' />
            </div>
            <div className='h-7 w-16 shrink-0 rounded-lg bg-muted' />
        </li>
    )
}

function ApiKeyRowItem({ apiKey }: { apiKey: ApiKeyRow }) {
    const utils = trpc.useUtils()
    const [confirming, setConfirming] = useState(false)
    const revokeMutation = trpc.admin.apiKeys.revoke.useMutation()

    return (
        <li className='flex items-center gap-3 px-4 py-3.5'>
            <div className='shrink-0 rounded-lg bg-primary/10 p-2 text-primary'>
                <KeyRound size={16} />
            </div>
            <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-foreground'>
                    {apiKey.name ?? 'Untitled key'}
                </p>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                    {apiKey.start ?? apiKey.prefix ?? '••••••'} · created {timeAgo(apiKey.createdAt)}
                    {apiKey.lastRequest && <> · last used {timeAgo(apiKey.lastRequest)}</>}
                    {!apiKey.enabled && (
                        <span className='ml-2 rounded-full bg-muted px-2 py-0.5 text-muted-foreground'>
                            disabled
                        </span>
                    )}
                </p>
            </div>

            <div className='flex shrink-0 items-center gap-1'>
                {confirming ? (
                    <>
                        <span className='mr-1 text-xs text-destructive'>Revoke?</span>
                        <button
                            onClick={() =>
                                revokeMutation.mutate(
                                    { keyId: apiKey.id },
                                    { onSuccess: () => utils.admin.apiKeys.list.invalidate() },
                                )
                            }
                            disabled={revokeMutation.isPending}
                            className='rounded p-1.5 text-destructive transition hover:bg-destructive/10 disabled:opacity-50'
                            aria-label='Confirm revoke'
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            disabled={revokeMutation.isPending}
                            className='rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50'
                            aria-label='Cancel revoke'
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setConfirming(true)}
                        className='rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-destructive/30 hover:text-destructive'
                    >
                        Revoke
                    </button>
                )}
            </div>
        </li>
    )
}

function CreateKeyForm({ onCreated }: { onCreated: (key: string) => void }) {
    const utils = trpc.useUtils()
    const [name, setName] = useState('')
    const createMutation = trpc.admin.apiKeys.create.useMutation()

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                if (!name.trim()) return
                createMutation.mutate(
                    { name: name.trim() },
                    {
                        onSuccess: (result: { key: string }) => {
                            setName('')
                            onCreated(result.key)
                            utils.admin.apiKeys.list.invalidate()
                        },
                    },
                )
            }}
            className='mb-4 flex items-center gap-2'
        >
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. weather-scraper'
                maxLength={32}
                className='flex-1 rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50'
            />
            <button
                type='submit'
                disabled={createMutation.isPending || !name.trim()}
                className='shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50'
            >
                {createMutation.isPending ? 'Creating…' : 'Create key'}
            </button>
        </form>
    )
}

export function ApiKeysList() {
    const [revealedKey, setRevealedKey] = useState<string | null>(null)
    const { data: apiKeys, isLoading } = trpc.admin.apiKeys.list.useQuery(undefined)

    return (
        <div>
            {revealedKey && (
                <CreatedKeyBanner apiKey={revealedKey} onDismiss={() => setRevealedKey(null)} />
            )}

            <CreateKeyForm onCreated={setRevealedKey} />

            {isLoading ? (
                <ul className='divide-y divide-border rounded-xl border border-border bg-card'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ApiKeySkeletonRow key={i} />
                    ))}
                </ul>
            ) : !apiKeys?.length ? (
                <div className='py-12 text-center'>
                    <p className='text-sm font-medium text-muted-foreground'>No API keys yet</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                        Create one above to authenticate programmatic requests.
                    </p>
                </div>
            ) : (
                <ul className='divide-y divide-border rounded-xl border border-border bg-card'>
                    {(apiKeys as ApiKeyRow[]).map((apiKey) => (
                        <ApiKeyRowItem key={apiKey.id} apiKey={apiKey} />
                    ))}
                </ul>
            )}
        </div>
    )
}
