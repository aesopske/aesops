import React, { Fragment } from 'react';
import { getRandomString, getNestedValue } from '@src/utils';


type ListWrapperProps = {
    list: any[]
    itemKey?: string
    renderFallback?: () => React.ReactNode
    children: (item: any, index: number) => React.ReactNode //eslint-disable-line
}

function ListWrapper({
    list,
    itemKey,
    children,
    renderFallback,
}: ListWrapperProps) {
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