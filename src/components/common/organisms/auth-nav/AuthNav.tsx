'use client'

import {
    SignInButton,
    SignUpButton,
    ClerkLoading,
    ClerkLoaded,
} from '@clerk/nextjs'
import React from 'react'
import Text from '@src/components/common/atoms/Text'
import { Button } from '@src/components/ui'

function AuthNav() {
    return (
        <div className='w-fit h-full flex gap-3 items-center'>
            <ClerkLoading>
                <span className='min-h-10 w-36 bg-brandaccent-100/70 animate-pulse rounded-full' />
            </ClerkLoading>
            <ClerkLoaded>
                <SignUpButton>
                    <Button className='rounded-full w-fit'>Get Started</Button>
                </SignUpButton>
                <Text className='text-sm'>or</Text>
                <SignInButton>
                    <Button variant='link' className='text-base w-fit p-0 '>
                        Sign In &rarr;
                    </Button>
                </SignInButton>
            </ClerkLoaded>
        </div>
    )
}

export default AuthNav
