import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeBar from './CodeBar'
import CodeExplain from './CodeExplain'

export type CodeContentTypes = {
    code: {
        language: string
        code: string
        filename?: string
    }
    allowAIExplain?: boolean
    _key?: string | null
    _type?: string | null
}

export type CodeBlockProps = {
    codeContent: CodeContentTypes
    hideCodeExplain?: boolean
    hideCodebar?: boolean
}

function CodeBlock({
    hideCodebar,
    codeContent,
    hideCodeExplain,
}: CodeBlockProps) {
    const language = codeContent?.code?.language ?? ''
    const code = codeContent?.code?.code ?? ''
    const filename = codeContent?.code?.filename ?? ''
    const allowCodeExplain = codeContent?.allowAIExplain ?? false

    return (
        <div className='my-5 w-full overflow-hidden rounded-xl border border-border shadow-xs'>
            {!hideCodebar && <CodeBar filename={filename} code={code} />}
            <SyntaxHighlighter
                language={language}
                wrapLines
                showLineNumbers
                lineNumberStyle={{
                    color: 'rgba(60,56,54,0.3)',
                    fontSize: '12px',
                    minWidth: '2.5em',
                }}
                customStyle={{
                    margin: 0,
                    padding: '1.25rem 1rem',
                    background: 'var(--brandaccent-50)',
                    opacity: 0.7,
                    fontSize: '13.5px',
                    lineHeight: '1.7',
                    fontFamily: 'var(--font-mono), monospace',
                }}
                style={gruvboxLight}>
                {code}
            </SyntaxHighlighter>
            {allowCodeExplain && !hideCodeExplain && (
                <CodeExplain code={codeContent} />
            )}
        </div>
    )
}

export default CodeBlock
