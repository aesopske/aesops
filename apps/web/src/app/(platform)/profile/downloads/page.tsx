import { DownloadAnalyticsSummary } from '../_components/download-analytics-summary'

export const metadata = { title: 'Downloads | Aesops' }

export default function ProfileDownloadsPage() {
    return (
        <div>
            <h2 className='text-lg font-medium text-foreground'>Downloads</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>
                How often your datasets have been downloaded, over time.
            </p>

            <div className='mt-4 rounded-xl border border-border bg-card p-6'>
                <DownloadAnalyticsSummary />
            </div>
        </div>
    )
}
