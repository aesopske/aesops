import Layout from '@/components/common/Layout'
import { fetchApp, fetchApps } from '@/utils/requests'
import { Box, Grid, GridItem, VStack } from '@chakra-ui/react'
import AppLinks from '@/components/apps/app/AppLinks'
import AppDescription from '@/components/apps/app/AppDescription'
import PageBanner from '@/components/common/PageBanner'
import UserAvatar from '@/components/common/UserAvatar'
import Share from '@/components/common/ShareBtns'

function AppDetail({ app, cookieConsent }) {
    return (
        <Layout
            title={app.title}
            description={app?.description}
            cookieConsent={cookieConsent}>
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
                    <GridItem colSpan='1'>
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
    const cookieConsent = ctx.req ? ctx.req.cookies.cookieConsent : null
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
            cookieConsent,
        },

        revalidate: 60 * (60 * 2),
    }
}

export async function getStaticPaths() {
    const data = await fetchApps({ limit: 100, page: 1 })

    return {
        paths: data.items.map((item) => ({
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
