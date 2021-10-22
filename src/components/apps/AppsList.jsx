import { Grid } from '@chakra-ui/layout'
import AppsListItem from './AppsListItem'

function AppsList({ apps }) {
    return (
        <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
            {apps.map((app) => (
                <AppsListItem key={app._id} app={app} />
            ))}
        </Grid>
    )
}

AppsList.defaultProps = {
    apps: [],
}

export default AppsList
