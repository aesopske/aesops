import React from 'react'
import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'

function IframePreview(props: PreviewProps) {
    const { title: src, subtitle } = props
    const iframeTitle = subtitle as string
    return (
        <Flex
            align='center'
            justify='center'
            padding={4}
            height='fill'
            width={800}>
            {typeof src === 'string' ? (
                <iframe
                    src={src}
                    height='500'
                    width='100%'
                    title={iframeTitle}
                    style={{
                        border: 0,
                        width: '100%',
                        height: '50vh',
                    }}
                    allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
                    sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
                />
            ) : (
                <Text>Missing Iframe URL</Text>
            )}
        </Flex>
    )
}
export default IframePreview
