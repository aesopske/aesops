'use client'

import { useQuery } from '@tanstack/react-query'
import { invoke } from '@src/lib/invoke'

function WakeupCall() {
    useQuery({
        queryKey: ['WakeupCall'],
        queryFn: async () => {
            const response = await invoke({
                endpoint: '/wake',
            })
            if (response.error) {
                throw new Error(response.error ?? 'Something went wrong')
            }
            return response.res
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    return null
}

export default WakeupCall
