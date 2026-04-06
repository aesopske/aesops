import React from 'react'
import { OctagonX } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'

function ErrorHandler({ error }) {
    return (
        <div className='p-5 space-y-4'>
            <Alert variant='destructive'>
                <OctagonX className='h-4 w-4' />
                <AlertTitle>Oops!! We have an opsy</AlertTitle>
                <AlertDescription>
                    {error.message ? error.message : 'Something went wrong'}
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default ErrorHandler
