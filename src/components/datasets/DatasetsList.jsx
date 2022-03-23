import { Box, Grid } from '@chakra-ui/react'
import DatasetsListItem from './DatasetsListItem'
import Unavailable from '../../components/common/Unavailable'

function DatasetsList({ datasets }) {
    return (
        <Box position='relative' minHeight='30vh'>
            <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
                {datasets.map((dataset) => (
                    <DatasetsListItem key={dataset._id} dataset={dataset} />
                ))}
            </Grid>

            {!datasets.length && (
                <Unavailable
                    message='No published apps'
                    src='/images/unavailable.svg'
                />
            )}
        </Box>
    )
}

DatasetsList.defaultProps = {
    datasets: [],
}

export default DatasetsList
