'use client'
import { Fragment, useEffect, useState } from 'react'
import { Slash } from 'lucide-react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PATH } from '@sanity/lib/types'
import ListWrapper from '@components/common/ListWrapper'
import { getBreadcrumbs } from '@src/lib/getBreadcrumbs'

function BreadCrumbs() {
    const [paths, setPaths] = useState<PATH[]>([])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const path = window.location.pathname
        const breadcrumbs = getBreadcrumbs(path)
        setPaths(breadcrumbs)
    }, [])
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href='/'
                        data-active={
                            typeof window !== 'undefined'
                                ? window?.location.pathname === '/'
                                : false
                        }
                        className='data-[active=false]:text-aes-dark font-sans'>
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <Slash size={16} />
                </BreadcrumbSeparator>
                <ListWrapper list={paths} itemKey='name'>
                    {(path: PATH) => (
                        <Fragment>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={path.href}
                                    aria-disabled={path.active}
                                    data-active={path.active}
                                    className='data-[active=false]:text-aes-dark capitalize aria-disabled:pointer-events-none aria-disabled:text-gray-500 font-sans'>
                                    {path.name}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className='last:hidden'>
                                <Slash size={16} />
                            </BreadcrumbSeparator>
                        </Fragment>
                    )}
                </ListWrapper>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
export default BreadCrumbs
