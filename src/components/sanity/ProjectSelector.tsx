'use client'

import { StringInputProps, set, unset } from 'sanity'
import React, { useCallback, useEffect, useState } from 'react'
import { invoke } from '@src/lib/invoke'
import { Select, Card, Spinner, Text, Button, Flex } from '@sanity/ui'
import ListWrapper from '../common/ListWrapper'

const cardProps = { shadow: 1, padding: 4, radius: 2 }

type Project = {
    name: string
    link: string
}

type Response = {
    res: {
        projects: Project[]
    }
}

function ProjectSelector(props: StringInputProps) {
    const { onChange, value } = props
    const { data, error, fetchProjects, loading } = useProjects()

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

    if (!data && loading)
        return (
            <Card tone='default' {...cardProps}>
                <Spinner />
            </Card>
        )
    return (
        <Flex gap={4}>
            <Select onChange={handleChange} value={value}>
                <option value=''>Select a project</option>
                <ListWrapper list={data} itemKey='name'>
                    {(item) => (
                        <option key={item?.name} value={item?.link}>
                            {item?.name}
                        </option>
                    )}
                </ListWrapper>
            </Select>
            <Button
                tone='default'
                loading={loading}
                text='Fetch projects'
                onClick={fetchProjects}
                disabled={loading || data?.length > 0}
            />
        </Flex>
    )
}

function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchProjects = useCallback(async () => {
        if (projects.length > 0) return
        try {
            setLoading(true)
            const response = await invoke<Response>({
                endpoint: '/projects/all',
            })

            if (response?.error) {
                const error = new Error(response?.error?.message)
                throw error
            }

            setProjects(response?.res?.projects)
        } catch (error) {
            setError(error)
            setProjects((prev) => prev)
        } finally {
            setLoading(false)
        }
    }, [projects.length])

    useEffect(() => {
        if (!error) return
        setTimeout(() => {
            setError(null)
        }, 5000)
    }, [error])
    return { error, data: projects, fetchProjects, loading }
}

export default ProjectSelector
