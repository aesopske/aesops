'use client'

import { ChevronRight } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@components/ui/breadcrumb'
import { getBreadcrumbs } from '@/lib/getBreadcrumbs'
import { cn } from '@/lib/utils'
import { PATH } from '~sanity/utils/types'

type BreadCrumbsProps = {
    color?: 'default' | 'light'
    className?: string
}

function BreadCrumbs({ color = 'default', className }: BreadCrumbsProps) {
    const [paths, setPaths] = useState<PATH[]>([])

    useEffect(() => {
        const path = window.location.pathname
        setPaths(getBreadcrumbs(path))
    }, [])

    const isLight = color === 'light'

    const linkClass = isLight
        ? 'text-primary-foreground/50 hover:text-primary-foreground/90 transition-colors duration-150'
        : 'text-muted-foreground hover:text-foreground transition-colors duration-150'

    const pageClass = isLight ? 'text-primary-foreground/75' : 'text-foreground/70'

    const separatorClass = isLight ? 'text-primary-foreground/25' : 'text-border'

    return (
        <Breadcrumb className={className}>
            <BreadcrumbList className='text-sm font-mono tracking-wide gap-1 sm:gap-1 flex-nowrap'>
                <BreadcrumbItem>
                    <BreadcrumbLink href='/' className={linkClass}>
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {paths.map((path) => (
                    <Fragment key={path.name}>
                        <BreadcrumbSeparator className={separatorClass}>
                            <ChevronRight className='w-3 h-3' />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem className='min-w-0'>
                            {path.active ? (
                                <BreadcrumbPage
                                    className={cn(
                                        pageClass,
                                        'text-sm font-mono capitalize max-w-[160px] sm:max-w-[280px] truncate block',
                                    )}>
                                    {path.name}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink
                                    href={path.href}
                                    className={cn(linkClass, 'capitalize')}>
                                    {path.name}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumbs
