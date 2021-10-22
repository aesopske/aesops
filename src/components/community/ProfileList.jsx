import { Box, Grid } from '@chakra-ui/layout'
import Unavailable from '../common/Unavailable'
import ProfileCard from './ProfileCard'

function ProfileList({ profiles }) {
    return (
        <Box>
            <Grid
                width={['90%', '', '', '80%', '100%']}
                mx='auto'
                gap='1rem'
                mt={['2rem', '10rem']}
                mb={['1rem', '5rem']}
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}>
                {profiles &&
                    profiles.map((profile) => (
                        <ProfileCard key={profile._id} profile={profile} />
                    ))}
            </Grid>
            {!profiles.length && (
                <Unavailable
                    src='/images/unavailable.svg'
                    message='no profiles available'
                />
            )}
        </Box>
    )
}

export default ProfileList
