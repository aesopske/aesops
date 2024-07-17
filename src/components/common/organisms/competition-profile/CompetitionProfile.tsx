import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Heading from '@components/common/atoms/Heading';
import Text from '@components/common/atoms/Text';
import ListWrapper from '../../ListWrapper';

async function CompetitionProfile() {
  const user = await currentUser();
  const myCompetitions = [
    {
      id: 1,
      name: 'Competition 1',
      description: 'This is the first competition',
      startDate: '2021-10-01',
      endDate: '2021-10-31',
      status: 'active',
      participants: 10,
      winner: null,
    },
    {
      id: 2,
      name: 'Competition 2',
      description: 'This is the second competition',
      startDate: '2021-11-01',
      endDate: '2021-11-30',
      status: 'active',
      participants: 10,
      winner: null,
    },
    {
      id: 3,
      name: 'Competition 3',
      description: 'This is the third competition',
      startDate: '2021-12-01',
      endDate: '2021-12-31',
      status: 'active',
      participants: 10,
      winner: null,
    },
  ];
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
              <div className='flex flex-col bg-white p-4 rounded-md border border-brandprimary-900'>
                <Heading type='h5' className='font-bold'>
                  {item.name}
                </Heading>
                <Text type='p' className=''>
                  {item.description}
                </Text>
                <Text type='p' className=''>
                  Start Date: {item.startDate}
                </Text>
                <Text type='p' className=''>
                  End Date: {item.endDate}
                </Text>
                <Text type='p' className=''>
                  Participants: {item.participants}
                </Text>
                <Text type='p' className=''>
                  Winner: {item.winner ? item.winner : 'Not declared yet'}
                </Text>
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

export default CompetitionProfile;
