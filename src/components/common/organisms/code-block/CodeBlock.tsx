import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as theme from 'react-syntax-highlighter/dist/esm/styles/prism'

import CodeBar from './CodeBar'
import CodeExplain from './CodeExplain'

type CodeBlockProps = {
    codeContent: {
        language: string
        code: string
        filename?: string
    }
}

function CodeBlock({ codeContent }: CodeBlockProps) {
    const language = codeContent?.language ?? ''
    const code = codeContent?.code ?? ''
    const filename = codeContent?.filename ?? ''

    return (
        <div className='my-5 w-full overflow-hidden rounded-md bg-aes-light/50 border border-gray-200'>
            <div className=''>
                <CodeBar filename={filename} code={code} />
                <SyntaxHighlighter
                    language={language}
                    wrapLongLines
                    className='rounded-md'
                    showLineNumbers
                    customStyle={{
                        borderRadius: '0.5rem',
                        fontFamily: 'Monolisa', // 'JetBrains Mono',
                        fontSize: '15px',
                        background: 'transparent',
                    }}
                    style={theme.gruvboxLight}>
                    {code}
                </SyntaxHighlighter>
            </div>
            <CodeExplain code={codeContent} />
        </div>
    )
}

export default CodeBlock
