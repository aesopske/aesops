/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */
import { defineConfig } from 'sanity'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { table } from '@sanity/table'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from './sanity/schema'

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
        vercelDeployTool({
            title: 'Deploy',
        }),
        presentationTool({
            name: 'preview',
            title: 'Preview',
            previewUrl: `${baseURL}/api/preview/enable`,
        }),
        codeInput({
            codeModes: [
                {
                    name: 'r',
                    loader: () =>
                        import('codemirror-lang-r').then(({ r }) => r()),
                },
            ],
        }),
        table(),
        unsplashImageAsset(),
    ],
})
