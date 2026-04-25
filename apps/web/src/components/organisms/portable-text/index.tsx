import {
    PortableText as RPText,
    PortableTextComponents,
    PortableTextBlock,
} from '@portabletext/react'

import SanityImage from './SanityImage'
import Heading from '@components/common/atoms/Heading'

const components: PortableTextComponents = {
    types: {
        image: SanityImage,
    },
    block: {
        h1: ({ children }) => <Heading>{children}</Heading>,
        h2: ({ children }) => <Heading type='h2'>{children}</Heading>,
        h3: ({ children }) => <Heading type='h3'>{children}</Heading>,
        h4: ({ children }) => <Heading type='h4'>{children}</Heading>,
    },
}

function PortableText({ content }: { content: PortableTextBlock[] }) {
    return <RPText value={content} components={components} />
}
export default PortableText
