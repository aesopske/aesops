import React, { Fragment } from 'react'
import { getRandomString, getNestedValue } from '@src/utils'

type ListWrapperProps<T> = {
    list: T[]
    itemKey?: string
    renderFallback?: () => React.ReactNode
    children: (item: T, index: number) => React.ReactNode //eslint-disable-line
}

function ListWrapper<T>({
    list,
    itemKey,
    children,
    renderFallback,
}: ListWrapperProps<T>) {
    // sanitize list
    if (!Array.isArray(list) || !list.length) {
        if (typeof renderFallback === 'function') {
            return renderFallback()
        }
        return null
    }
    return (
        <Fragment>
            {list.map((item, index) => {
                let key = getRandomString('AES-LST', 12)
                if (itemKey) {
                    key = getNestedValue(item, itemKey) ?? key
                }

                return <Fragment key={key}>{children(item, index)}</Fragment>
            })}
        </Fragment>
    )
}
export default ListWrapper
