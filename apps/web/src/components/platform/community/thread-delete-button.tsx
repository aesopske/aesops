'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@repo/ui/components/button'
import { trpc } from '@/trpc/react'

export function ThreadDeleteButton({ threadId }: { threadId: string }) {
    const router = useRouter()
    const deleteThread = trpc.community.deleteThread.useMutation()

    return (
        <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 shrink-0 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10'
            disabled={deleteThread.isPending}
            onClick={() =>
                deleteThread.mutate(
                    { threadId },
                    { onSuccess: () => router.push('/community/discussions') },
                )
            }>
            <Trash2 size={14} />
        </Button>
    )
}
