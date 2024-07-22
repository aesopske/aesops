import { SignInButton, SignUpButton, SignedOut } from '@clerk/nextjs'
import React from 'react'
import Text from '@src/components/common/atoms/Text'
import { Button } from '@src/components/ui'

function AuthNav() {
    return (
        <div className='w-full h-full flex gap-3 items-center'>
            <SignedOut>
                <SignUpButton>
                    <Button className='rounded-full w-fit'>Get Started</Button>
                </SignUpButton>
                <Text className='text-sm'>or</Text>
                <SignInButton>
                    <Button variant='link' className='text-base w-fit '>
                        Sign In &rarr;
                    </Button>
                </SignInButton>
            </SignedOut>
        </div>
    )
}

export default AuthNav
