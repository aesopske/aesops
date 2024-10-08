'use client'

import { useQuery } from '@tanstack/react-query'
import { StringInputProps, set, unset } from 'sanity'
import React from 'react'
import { invoke } from '@src/lib/invoke'
import { Select, Card, Spinner, Text, Button, Flex } from '@sanity/ui'
import ListWrapper from '../common/ListWrapper'

const cardProps = { shadow: 1, padding: 4, radius: 2 }

type Project = {
    name: string
    link: string
}

type Response = {
    projects: Project[]
}

function ProjectSelector(props: StringInputProps) {
    const { onChange, value } = props

    const { data, error, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const response = await invoke<Response>({
                endpoint: '/projects/all',
            })

            if (response.error) {
                throw new Error(response?.error ?? 'An error occurred')
            }

            return response?.res?.projects as Project[]
        },
        refetchOnWindowFocus: false,
        placeholderData: (prev) => (prev ? prev : []),
    })

    const handleChange = React.useCallback(
        (event: React.FormEvent<HTMLSelectElement> | undefined) => {
            const val = event?.currentTarget.value
            onChange(val ? set(val) : unset())
        },
        [onChange],
    )

    if (error)
        return (
            <Card tone='critical' {...cardProps}>
                <Text>There has been an error</Text>
            </Card>
        )

    if (!data && isLoading)
        return (
            <Card tone='default' {...cardProps}>
                <Spinner />
            </Card>
        )
    return (
        <Flex gap={2}>
            <Select onChange={handleChange} value={value}>
                <option value=''>Select a project</option>
                <ListWrapper list={data ?? []} itemKey='name'>
                    {(item) => (
                        <option key={item?.name} value={item?.link}>
                            {item?.name}
                        </option>
                    )}
                </ListWrapper>
            </Select>
            <Button
                mode='ghost'
                text='Refresh'
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
            />
        </Flex>
    )
}

export default ProjectSelector
