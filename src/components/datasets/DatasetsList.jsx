import { Grid } from '@chakra-ui/layout'
import DatasetsListItem from './DatasetsListItem'

function DatasetsList({ datasets }) {
    return (
        <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
            {datasets.map((dataset) => (
                <DatasetsListItem key={dataset._id} dataset={dataset} />
            ))}
        </Grid>
    )
}

DatasetsList.defaultProps = {
    datasets: [],
}

export default DatasetsList
