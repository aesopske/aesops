import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@src/components/ui/badge'
import { urlForImage } from '@sanity/utils/image'
import { COMPETITION } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'

function CompetitionCard({ competition }: { competition: COMPETITION }) {
    const imageUrl = urlForImage(competition.mainImage) ?? ''
    return (
        <div className='bg-white h-auto w-full rounded-md shadow-xs flex flex-col justify-between gap-2 align-start overflow-hidden'>
            <div>
                <div className='h-48 w-full'>
                    <Image
                        src={imageUrl}
                        alt={competition?.mainImage?.alt ?? ''}
                        width={400}
                        height={400}
                        className='object-cover h-full w-full'
                    />
                </div>
                <Link href={`/competitions/${competition.slug?.current}`}>
                    <div className='p-4 flex flex-col gap-2 items-start justify-start '>
                        <Heading type='h4' className='font-bold'>
                            {competition.title}
                        </Heading>
                        <div className='flex flex-col items-start justify-start gap-2'>
                            {/* <div className='space-x-1'>
                                <Text as='small' className='text-sm'>
                                    From{' '}
                                    {format(
                                        competition.startDate,
                                        'dd MMM yyyy',
                                    )}{' '}
                                    &bull;{' '}
                                </Text>

                                {competition.endDate ? (
                                    <Text as='small' className='text-sm'>
                                        {competition.endDate
                                            ? format(
                                                  competition.endDate,
                                                  'dd MMM yyyy',
                                              )
                                            : 'Ongoing'}
                                    </Text>
                                ) : (
                                    <Badge className='rounded-full'>
                                        Ongoing
                                    </Badge>
                                )}
                            </div> */}
                            <Text className='text-sm line-clamp-3'>
                                {competition.description}
                            </Text>
                        </div>
                    </div>
                </Link>
            </div>
            <div className='px-4  border-t py-4'>
                {/* <AesopLink
                    href={`/competitions/${competition.slug?.current}`}
                    type='button'
                    variant='dark'>
                    Join &rarr;
                </AesopLink> */}
                <div className='space-x-1'>
                    <Text as='small' className='text-sm'>
                        From{' '}
                        {format(
                            new Date(competition?.startDate),
                            'dd MMM yyyy',
                        )}{' '}
                        &bull;{' '}
                    </Text>

                    {competition.endDate ? (
                        <Text as='small' className='text-sm'>
                            {competition.endDate
                                ? format(
                                      new Date(competition.endDate),
                                      'dd MMM yyyy',
                                  )
                                : 'Ongoing'}
                        </Text>
                    ) : (
                        <Badge className='rounded-full'>Ongoing</Badge>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CompetitionCard
