import { Gem } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'value',
    title: 'Values',
    type: 'document',
    icon: Gem,
    fields: [
        defineField({
            name: 'value',
            title: 'Value',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
                list: [
                    { title: 'Footprints', value: 'footprints' },
                    { title: 'Handshake', value: 'handshake' },
                    { title: 'Focus', value: 'focus' },
                    { title: 'ShieldCheck', value: 'shieldcheck' },
                    { title: 'BriefcaseBusiness', value: 'briefcasebusiness' },
                ],
            },
        }),
    ],
})
