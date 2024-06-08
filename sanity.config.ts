/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { table } from '@sanity/table'
import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from './sanity/schema'
import { apiVersion, dataset, projectId } from './sanity/env'

const baseURL =
    process.env.NODE_ENV === 'production'
        ? 'https://aesops.co.ke'
        : process.env.VERCEL_ENV === 'preview'
          ? process.env.VERCEL_URL
          : 'http://localhost:3000'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    plugins: [
        structureTool({
            name: 'Documents',
            icon: () => '📄',
        }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
        presentationTool({
            name: 'preview',
            title: 'Preview',
            previewUrl: `${baseURL}/api/preview/enable`,
        }),
        codeInput(),
        table(),
        unsplashImageAsset(),
    ],
})
