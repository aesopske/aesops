import { PendingReviewList } from './_components/pending-review-list'

export const metadata = { title: 'Dataset review | Admin | Aesops' }

export default function AdminDatasetReviewPage() {
    return (
        <div>
            <h2 className='text-lg font-medium text-foreground'>Dataset review</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>
                Revisions held back after an automated upload dropped an unusually large share
                of rows compared to the previous version.
            </p>
            <div className='mt-4'>
                <PendingReviewList />
            </div>
        </div>
    )
}
