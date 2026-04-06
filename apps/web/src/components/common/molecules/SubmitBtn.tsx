'use client'

import { Loader } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import React from 'react'
import { Button } from '@components/ui/button'

interface SubmitBtnProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function SubmitBtn(props: SubmitBtnProps) {
    const { pending } = useFormStatus()
    return (
        <Button {...props} type='submit' disabled={pending}>
            {pending ? (
                <Loader size={20} className='animate-spin mr-2' />
            ) : null}
            {props.children || 'Submit'}
        </Button>
    )
}

export default SubmitBtn
