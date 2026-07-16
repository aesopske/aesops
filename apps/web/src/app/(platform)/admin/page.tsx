import { AiUsageDashboard } from '@/components/platform/admin/ai-usage-dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'AI usage | Admin | Aesops' }

export default function AdminAiUsagePage() {
    return (
        <div>
            <h2 className='text-lg font-medium text-foreground'>AI usage</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>
                Requests, tokens, and latency across dataset chat, @aisops
                replies, and other AI-backed routes.
            </p>
            <div className='mt-4'>
                <AiUsageDashboard />
            </div>
        </div>
    )
}
