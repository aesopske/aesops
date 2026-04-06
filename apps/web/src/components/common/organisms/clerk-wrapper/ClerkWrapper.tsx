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
        <div>
            <div>{renderLoading && renderLoading()}</div>
            <div>
                <div>{renderSignedIn && renderSignedIn()}</div>
                <div>{renderSignedOut && renderSignedOut()}</div>
            </div>
        </div>
    )
}

export default ClerkWrapper
