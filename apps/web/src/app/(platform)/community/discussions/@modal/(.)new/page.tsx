'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@repo/ui/components/dialog'
import { CreateThreadForm } from '@/components/platform/community/create-thread-form'

export default function NewThreadModal() {
    const router = useRouter()

    return (
        <Dialog open onOpenChange={(open: boolean) => { if (!open) router.back() }}>
            <DialogContent aria-describedby={undefined} className='sm:max-w-xl'>
                <DialogHeader>
                    <DialogTitle>Start a discussion</DialogTitle>
                    <DialogDescription>
                        Share a topic with the Aesops community. Optionally link it to a dataset or blog post.
                    </DialogDescription>
                </DialogHeader>
                <Suspense>
                    <CreateThreadForm />
                </Suspense>
            </DialogContent>
        </Dialog>
    )
}
