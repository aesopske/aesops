import { defineType, defineArrayMember } from 'sanity'

export default defineType({
    name: 'pageSections',
    title: 'Page Sections',
    type: 'array',
    of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'pageHeroBlock' }),
        defineArrayMember({ type: 'blogListBlock' }),
        defineArrayMember({ type: 'featuredPostsBlock' }),
        defineArrayMember({ type: 'recentPostsBlock' }),
        defineArrayMember({ type: 'featuresBlock' }),
        defineArrayMember({ type: 'ourStoryBlock' }),
        defineArrayMember({ type: 'missionVisionBlock' }),
        defineArrayMember({ type: 'ourValuesBlock' }),
        defineArrayMember({ type: 'ourTeamBlock' }),
    ],
})
