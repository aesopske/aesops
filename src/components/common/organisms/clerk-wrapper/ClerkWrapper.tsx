import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from '@clerk/nextjs'
import React from 'react'

type ClerkWrapperProps = {
    renderSignedIn?: () => React.JSX.Element
    renderSignedOut?: () => React.JSX.Element
    renderLoading?: () => React.JSX.Element
}

function ClerkWrapper({
    renderSignedIn,
    renderSignedOut,
    renderLoading,
}: ClerkWrapperProps) {
    return (
        <>
            <ClerkLoading>{renderLoading && renderLoading()}</ClerkLoading>
            <ClerkLoaded>
                <SignedIn>{renderSignedIn && renderSignedIn()}</SignedIn>
                <SignedOut>{renderSignedOut && renderSignedOut()}</SignedOut>
            </ClerkLoaded>
        </>
    )
}

export default ClerkWrapper
