import AesopLink from '@components/common/atoms/AesopLink'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import SubscriptionForm from './SubscriptionForm'

function TalkToUs() {
    return (
        <section className='bg-brandprimary-700 h-auto pb-10 container mx-auto max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-5 p-0 md:h-96 md:pb-0 xl:rounded-3xl'>
            <div className="bg-[url('/svg/quadpattern.svg')] h-28 w-full bg-no-repeat bg-center bg-cover cols-span-1 md:h-full" />
            <div className='w-full py-0 px-5 space-y-4 md:py-20 md:px-10 lg:px-12 lg:max-w-xl '>
                <div>
                    <Heading
                        type='h2'
                        className='text-brandaccent-50 font-black'>
                        Subscribe to our newsletter.
                    </Heading>
                    <Text className='text-white font-sm opacity-80'>
                        Stay up to date with the latest news and updates.
                    </Text>
                </div>
                <SubscriptionForm />
                <Text className='text-white'>
                    By subscribing, you agree to our{' '}
                    <AesopLink
                        href='/privacy-policy'
                        className='text-white font-bold underline decoration-dashed underline-offset-4'>
                        Privacy Policy
                    </AesopLink>
                </Text>
            </div>
        </section>
    )
}

export default TalkToUs
