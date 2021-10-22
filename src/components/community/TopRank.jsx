import { Box, Grid, Stack, useColorMode } from '@chakra-ui/react'
import TopRankCard from './TopRankCard'

function TopRank({ profiles }) {
    const { colorMode } = useColorMode()
    return (
        <Box
            as={Stack}
            justifyContent='center'
            alignItems='center'
            width='100%'
            height={['auto', 'auto', 'auto', '50vh', '40vh']}
            bgImage={
                colorMode === 'light'
                    ? '/images/background.png'
                    : '/svg/hero-dark.svg'
            }
            bgRepeat='no-repeat'
            p='10px'
            bgPosition='center'
            position='relative'
            my='1rem'
            zIndex='0'
            borderRadius='10px'
            bgSize='cover'>
            <Grid
                gap='3rem'
                position={['relative', 'absolute']}
                bottom={['', '-5rem']}
                templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                width={['90%', '90%', '90%', '80%', '80%']}
                mt={['2rem', '6rem']}
                zIndex='60'
                mx='auto'>
                {profiles &&
                    profiles.map((profile) => (
                        <TopRankCard key={profile._id} profile={profile} />
                    ))}
            </Grid>
        </Box>
    )
}

export default TopRank
