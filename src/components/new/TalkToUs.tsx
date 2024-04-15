import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import AesopLink from '@components/common/atoms/AesopLink'

function TalkToUs() {
    return (
        <section className='bg-aes-primary h-96 rounded-3xl container mx-auto max-w-screen-lg grid grid-cols-2 gap-5 p-0'>
            <div className="bg-[url('/svg/quadpattern.svg')] h-full bg-no-repeat bg-cover cols-span-1" />
            <div className='w-full py-20 px-10 space-y-2'>
                <Heading type='h2' className='text-white font-black'>
                    Subscribe to our newsletter
                </Heading>
                <Text className='text-white font-sm opacity-80'>
                    Stay up to date with the latest news and updates.
                </Text>
                <form className='flex flex-col space-y-4'>
                    <input
                        type='email'
                        placeholder='Enter your email'
                        className='p-2 rounded-md'
                    />
                    <button className='bg-aes-secondary text-white p-2 rounded-md'>
                        Subscribe
                    </button>
                </form>
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
