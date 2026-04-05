import { Stars } from 'lucide-react'
import { defineType, defineField } from 'sanity'
import CodePreview from '@src/components/sanity/CodePreview'
import { CodeBlockIcon } from '@sanity/icons'

export default defineType({
    title: 'Code Block',
    name: 'codeBlock',
    type: 'object',
    icon: CodeBlockIcon,
    fields: [
        defineField({
            title: 'Code',
            name: 'code',
            type: 'code',
            options: {
                withFilename: true,
                language: 'text',
                languageAlternatives: [
                    { title: 'JavaScript', value: 'javascript' },
                    { title: 'TypeScript', value: 'typescript' },
                    { title: 'Python', value: 'python' },
                    { title: 'HTML', value: 'html' },
                    { title: 'CSS', value: 'css' },
                    { title: 'JSON', value: 'json' },
                    { title: 'Markdown', value: 'markdown' },
                    { title: 'Bash', value: 'sh', mode: 'shell' },
                    { title: 'R', value: 'r', mode: 'r' },
                    { title: 'Plain Text', value: 'text' },
                ],
            },
        }),
        defineField({
            title: 'Allow AI explain',
            name: 'allowAIExplain',
            type: 'boolean',
            icon: Stars,
        }),
    ],
    components: {
        preview: CodePreview,
    },
    preview: {
        select: {
            code: 'code',
            allowAIExplain: 'allowAIExplain',
        },
        prepare({ code, allowAIExplain }) {
            return {
                title: code ? `${code.filename}` : 'Code Block',
                subtitle: allowAIExplain ? 'With AI Explain' : '',
                codeContent: {
                    code,
                    allowAIExplain,
                },
            }
        },
    },
})
