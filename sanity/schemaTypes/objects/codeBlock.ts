import { Code, Stars } from 'lucide-react'
import { defineType, defineField } from 'sanity'

export default defineType({
    title: 'Code Block',
    name: 'codeBlock',
    type: 'object',
    icon: Code,
    fields: [
        defineField({
            title: 'Code',
            name: 'code',
            type: 'code',
            options: {
                withFilename: true,
            },
        }),
        defineField({
            title: 'Allow AI explain',
            name: 'allowAIExplain',
            type: 'boolean',
            icon: Stars,
        }),
    ],
})
