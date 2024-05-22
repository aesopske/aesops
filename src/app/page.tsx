import Image from 'next/image'

import Hero from '@/components/common/Hero'
import Datasets from '@/components/new/Datasets'
import Community from '@src/components/new/Community'
import Services from '@src/components/new/Services'
import TalkToUs from '@src/components/new/TalkToUs'
import Text from '@src/components/common/atoms/Text'
import RecentPosts from '@/components/new/RecentPosts'
import Consultancy from '@/components/new/Consultancy'
import Heading from '@src/components/common/atoms/Heading'
import AesopLink from '@src/components/common/atoms/AesopLink'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'

export const metadata = {
    title: 'Aesops - Unveiling Insights',
    description:
        'Are you looking to get insights for your data and make data-driven decisions? Aesops is a pioneering data organization based in Kenya, dedicated to revolutionizing the data sector in the country. AESOPS has rapidly evolved into a dynamic platform that collects, curates, and disseminates data, fostering a culture of data-driven decision-making and innovation.',
}

function Page() {
    return (
        <div className='w-full h-full min-h-screen'>
            <Hero />
            <Services />
            <HasBackgroundWrapper>
                <div className='h-full w-full text-white max-w-screen-xl mx-auto  grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-col-3'>
                    <div className='max-w-2xl space-y-6 text-aes-light px-5 py-24 pb-10 lg:py-48 lg:px-0'>
                        <Heading type='h1' className='text-current'>
                            Why Aesops ?
                        </Heading>

                        <Text className='text-current font-light'>
                            AESOPS is a pioneering data organization based in
                            Kenya, dedicated to revolutionizing the data sector
                            in the country. Established in 2018 and officially
                            launched in 2020, AESOPS has rapidly evolved into a
                            dynamic platform that collects, curates, and
                            disseminates data, fostering a culture of
                            data-driven decision-making and innovation.
                        </Text>
                        <Text className='space-x-4 flex flex-col gap-3 items-start md:flex-row md:items-center'>
                            <AesopLink
                                href='/about-us'
                                variant='button'
                                color='secondary'>
                                Mission & Vision
                            </AesopLink>

                            <AesopLink
                                href='/about-us#team'
                                className='text-aes-light'>
                                Meet the team &rarr;
                            </AesopLink>
                        </Text>
                    </div>
                    <div className='relative h-28 w-full md:h-full '>
                        <Image
                            src='/svg/quadpattern.svg'
                            alt='hero'
                            width={500}
                            height={1000}
                            className='object-cover w-full h-full object-center'
                        />
                    </div>
                </div>
            </HasBackgroundWrapper>
            <Datasets />
            <Consultancy />
            <div className='relative h-full py-10'>
                <HasBackgroundWrapper className=' h-auto max-w-4xl flex items-center mx-auto md:rounded-3xl'>
                    <div className='max-w-lg mx-auto space-y-4 p-10 md:py-28'>
                        <Heading type='h2' className='text-aes-light text-2xl'>
                            What our clients say.
                        </Heading>
                        <Text className='text-aes-light'>
                            &quot;Aesop has been a great partner in helping us
                            understand our data. Their team of experts have
                            provided us with actionable insights that have
                            helped us make informed decisions.&quot;
                        </Text>
                        <Text className='text-aes-light font-bold'>
                            John Doe, CEO, Aesops Ltd
                        </Text>
                    </div>
                </HasBackgroundWrapper>
            </div>
            <Community />
            <RecentPosts className='px-5 xl:px-0' />
            {/* TODO: find a way to import svgs as components in Nextjs */}
            <TalkToUs />
        </div>
    )
}

export default Page
