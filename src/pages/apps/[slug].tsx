import { Box, Grid, GridItem, VStack } from '@chakra-ui/react'

import { APP } from '@/types'
import Layout from '@/components/common/Layout'
import Share from '@/components/common/ShareBtns'
import AppLinks from '@/components/apps/app/AppLinks'
import { fetchApp, fetchApps } from '@/utils/requests'
import PageBanner from '@/components/common/PageBanner'
import UserAvatar from '@/components/common/UserAvatar'
import AppDescription from '@/components/apps/app/AppDescription'

type AppDetailProps = {
    app: APP
}

function AppDetail({ app }: AppDetailProps) {
    return (
        <Layout title={app.title} description={app?.description}>
            <Box
                width={['95%', '90%', '90%', '80%', '', '75%']}
                mx='auto'
                height='auto'
                minHeight='50vh'>
                <PageBanner heading={app?.title}>
                    <UserAvatar
                        user={{
                            name: app?.author,
                            date: new Date(app?.created).toDateString(),
                        }}
                        onSurface
                        size='md'
                    />
                </PageBanner>
                <Grid
                    my='2rem'
                    gap='2rem'
                    position='relative'
                    templateColumns={[
                        'repeat(1, 1fr)',
                        'repeat(1, 1fr)',
                        'repeat(2, 1fr)',
                        'repeat(3, 1fr)',
                    ]}>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <AppDescription app={app} />
                    </GridItem>
                    <GridItem>
                        <VStack
                            position={[
                                'relative',
                                'relative',
                                'relative',
                                'sticky',
                            ]}
                            zIndex='10'
                            top={['0', '0', '0', '6rem']}
                            left='0'>
                            <Share title={app?.title} />
                            <AppLinks app={app} />
                        </VStack>
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    const { slug } = ctx.params
    const data = await fetchApp(slug)

    if (!data) {
        return {
            redirect: {
                destination: '/',
                persistant: false,
            },
        }
    }

    return {
        props: {
            app: data.item,
        },

        revalidate: 60 * (60 * 2),
    }
}

export async function getStaticPaths() {
    const data = await fetchApps({ limit: 100, page: 1 })

    return {
        paths: data.items.map((item: APP) => ({
            params: {
                slug: item.slug,
            },
        })),
        fallback: 'blocking',
    }
}

AppDetail.defaultProps = {
    app: {},
}

export default AppDetail
