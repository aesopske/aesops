import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as theme from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeBar from './CodeBar'
import CodeExplain from './CodeExplain'

type CodeBlockProps = {
    codeContent: {
        code: {
            language: string
            code: string
            filename?: string
        }
        allowAIExplain?: boolean
        _key?: string
        _type?: string
    }
}

function CodeBlock({ codeContent }: CodeBlockProps) {
    const language = codeContent?.code?.language ?? ''
    const code = codeContent?.code?.code ?? ''
    const filename = codeContent?.code?.filename ?? ''

    const allowCodeExplain = codeContent?.allowAIExplain ?? false

    return (
        <div className='my-5 w-full overflow-hidden rounded-md bg-brandaccent-50/50 border border-brandaccent-50/50 shadow-sm'>
            <div className=''>
                <CodeBar filename={filename} code={code} />
                <SyntaxHighlighter
                    language={language}
                    className='py-0'
                    wrapLines
                    showLineNumbers
                    customStyle={{
                        fontSize: '15px',
                        background: 'transparent',
                    }}
                    style={theme.gruvboxLight}>
                    {code}
                </SyntaxHighlighter>
            </div>
            {allowCodeExplain && <CodeExplain code={codeContent} />}
        </div>
    )
}

export default CodeBlock
