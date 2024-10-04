import React from 'react'
import { PreviewCodeProps } from '@sanity/code-input'
import { Stack } from '@sanity/ui'
import CodeBlock, {
    CodeContentTypes,
} from '../common/organisms/code-block/CodeBlock'

type CodePreviewProps = {
    codeContent: CodeContentTypes
} & PreviewCodeProps

function CodePreview(props: CodePreviewProps) {
    return (
        <Stack padding={2}>
            {props.renderDefault(props)}
            <CodeBlock
                hideCodebar
                hideCodeExplain
                codeContent={props.codeContent}
            />
        </Stack>
    )
}

export default CodePreview
