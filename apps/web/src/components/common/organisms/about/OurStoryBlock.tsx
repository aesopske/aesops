import Image from 'next/image'
import { Badge } from '@components/ui/badge'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import { urlForImage } from '~sanity/utils/image'
import { OurStoryBlock as OurStoryBlockType } from '~sanity/utils/types'

function OurStoryBlock({ block }: { block: OurStoryBlockType }) {
    const imageUrl = block.image ? urlForImage(block.image) : null

    return (
        <section id='about' className='min-h-96 bg-brandprimary-700 text-brandaccent-50'>
            <div className='max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) px-6 grid grid-cols-1 md:grid-cols-2 col-span-2 mx-auto md:gap-4 h-full 2xl:px-0'>
                <div className='space-y-4 text-brandaccent-50 py-6 lg:py-24'>
                    <Badge variant='secondary' className='rounded-full'>
                        Our Story
                    </Badge>
                    <Heading className='text-current'>{block.heading}</Heading>
                    <Text className='text-current font-light max-w-xl'>
                        {block.description}
                    </Text>
                </div>
                {imageUrl && (
                    <div className='py-6 h-60 w-full grid grid-cols-3 gap-4 md:h-72 lg:h-96 lg:gap-8'>
                        {(
                            [
                                'object-left',
                                'object-center',
                                'object-right',
                            ] as const
                        ).map((pos, i) => (
                            <div key={i} className='h-full rounded-full overflow-hidden'>
                                <Image
                                    src={imageUrl}
                                    width={500}
                                    height={500}
                                    alt={block.image?.alt ?? block.heading}
                                    className={`h-full w-full object-cover ${pos} scale-125`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default OurStoryBlock
