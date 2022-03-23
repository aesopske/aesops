import { Grid, Box } from '@chakra-ui/react'
import Unavailable from '../common/Unavailable'
import AppsListItem from './AppsListItem'

function AppsList({ apps }) {
    return (
        <Box position='relative' minHeight='30vh'>
            <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
                {apps.map((app) => (
                    <AppsListItem key={app._id} app={app} />
                ))}
            </Grid>

            {!apps.length && (
                <Unavailable
                    message='No published apps'
                    src='/images/unavailable.svg'
                />
            )}
        </Box>
    )
}

AppsList.defaultProps = {
    apps: [],
}

export default AppsList
