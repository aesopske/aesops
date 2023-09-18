import { Box, Grid } from '@chakra-ui/react'

import { DATASET } from '@/types'
import DatasetsListItem from './DatasetsListItem'
import Unavailable from '../../components/common/Unavailable'

type DatasetsListProps = {
    datasets: DATASET[]
}

function DatasetsList({ datasets }: DatasetsListProps) {
    return (
        <Box position='relative' minHeight='30vh'>
            <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
                {datasets.map((dataset) => (
                    <DatasetsListItem key={dataset._id} dataset={dataset} />
                ))}
            </Grid>

            {!datasets.length && (
                <Unavailable
                    message='No published datasets found'
                    src='/images/unavailable.svg'
                />
            )}
        </Box>
    )
}

export default DatasetsList
