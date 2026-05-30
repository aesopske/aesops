'use client'

import type { DocumentMetadata } from '@repo/db/schema'
import { DatasetSummaryStrip } from '@/components/platform/dataset/dataset-summary-strip'
import { DatasetChartGrid } from '@/components/platform/dataset/dataset-chart-grid'

type Props = { meta: DocumentMetadata }

export function DatasetVisualizations({ meta }: Props) {
    return (
        <div className='space-y-5'>
            <DatasetSummaryStrip columns={meta.columns} />
            <DatasetChartGrid columns={meta.columns} rowCount={meta.rowCount} />
        </div>
    )
}
