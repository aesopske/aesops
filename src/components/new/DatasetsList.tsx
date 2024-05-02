import { fetchDatasets } from '@/utils/requests'

async function DatasetsList() {
    const datasets = await fetchDatasets({ limit: 4 })

    return (
        <div className='bg-aes-light min-h-96 w-full p-12 rounded-lg'>
            {/* <pre>{JSON.stringify(datasets, null, 3)}</pre> */}
        </div>
    )
}
export default DatasetsList
