import { SignedIn, SignedOut } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { format } from 'date-fns'
import React from 'react'
import { Badge } from '@src/components/ui/badge'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import ListWrapper from '../../ListWrapper'
import AesopLink from '../../atoms/AesopLink'

async function CompetitionProfile() {
    const user = await currentUser()
    const myCompetitions = [
        {
            id: 1,
            name: 'Titanic - Machine Learning from Disaster',
            description:
                'This is the legendary Titanic ML competition – the best, first challenge for you to dive into ML competitions and familiarize yourself with how the Kaggle platform works.',
            startDate: '07-17-2024',
            endDate: '07-16-2025',
            participants: 10,
        },
        {
            id: 2,
            name: 'Predict Fire Extent',
            description:
                'Welcome to our beginner-friendly Machine Learning Hackathon! This challenge is specially designed for first-time participants, offering a safe and supportive environment where you can learn, collaborate, ask questions and grow with fellow newcomers.',
            startDate: '07-17-2024',
            endDate: null,
            participants: 234,
        },
    ]
    return (
        <div className='w-full h-full space-y-6'>
            <SignedIn>
                <div className='max-w-2xl'>
                    <Heading type='h4' className='font-bold'>
                        Welcome back, {user?.firstName}
                    </Heading>
                    <Text type='p' className=''>
                        These are the competitions that your are currently in.
                    </Text>
                </div>
                <div className='grid grid-cols-4 gap-4'>
                    <ListWrapper list={myCompetitions} itemKey='id'>
                        {(item) => (
                            <div className='flex flex-col justify-between gap-2 bg-white p-4 rounded-md'>
                                <div className='space-y-2'>
                                    <Heading type='h5' className='font-bold'>
                                        {item.name}
                                    </Heading>
                                    <Text
                                        type='p'
                                        className='line-clamp-2 text-sm'>
                                        {item.description}
                                    </Text>
                                </div>
                                <div className='flex items-center justify-between gap-3'>
                                    <Text as='small' className='text-sm'>
                                        From &bull;{' '}
                                        {item.startDate
                                            ? format(
                                                  new Date(item.startDate),
                                                  'dd MMM, yyyy',
                                              )
                                            : 'N/A'}
                                    </Text>
                                    {item.endDate ? (
                                        <Text as='small' className='text-sm'>
                                            To &bull;{' '}
                                            {format(
                                                new Date(item.endDate),
                                                'dd MMM, yyyy',
                                            )}
                                        </Text>
                                    ) : (
                                        <Badge className='rounded-full'>
                                            Ongoing
                                        </Badge>
                                    )}
                                </div>
                                <div className='flex items-center justify-between'>
                                    <AesopLink
                                        type='button'
                                        variant='dark'
                                        className='w-fit py-2'
                                        href='/competition/1'>
                                        Continue &rarr;
                                    </AesopLink>
                                    <Text as='small' className='text-sm'>
                                        {item.participants} participants
                                    </Text>
                                </div>
                            </div>
                        )}
                    </ListWrapper>
                </div>
            </SignedIn>
            <SignedOut>
                <Heading type='h4' className=''>
                    Join a competition & share your knowledge.
                </Heading>
            </SignedOut>
        </div>
    )
}

export default CompetitionProfile
