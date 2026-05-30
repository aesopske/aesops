/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */
import { defineConfig } from 'sanity'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
// import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { table } from '@sanity/table'
import { visionTool } from '@sanity/vision'
import { Megaphone, NotepadText, Rss, Scale } from 'lucide-react'
import { apiVersion, dataset, projectId } from './sanity/env'
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from './sanity/schema'

// const baseURL =
//     process.env.NODE_ENV === 'production'
//         ? 'https://aesops.co.ke'
//         : process.env.VERCEL_ENV === 'preview'
//           ? process.env.VERCEL_URL
//           : 'http://localhost:3000'

const config = defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    // Add and edit the content schema in the './sanity/schema' folder
    schema,
    plugins: [
        structureTool({
            name: 'Documents',
            icon: () => '📄',
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Pages')
                            .icon(NotepadText)
                            .child(
                                S.list()
                                    .title('Pages')
                                    .items([
                                        S.listItem()
                                            .title('All')
                                            .icon(NotepadText)
                                            .child(
                                                S.documentList()
                                                    .title('All Pages')
                                                    .apiVersion(apiVersion)
                                                    .filter('_type == "page"'),
                                            ),
                                        S.divider(),
                                        S.listItem()
                                            .title('Blog Posts')
                                            .icon(Rss)
                                            .child(
                                                S.documentList()
                                                    .title('Blog Posts')
                                                    .apiVersion(apiVersion)
                                                    .filter(
                                                        '_type == "page" && pageType == "blog"',
                                                    ),
                                            ),
                                        S.listItem()
                                            .title('Default Pages')
                                            .icon(Megaphone)
                                            .child(
                                                S.documentList()
                                                    .title('Default Pages')
                                                    .apiVersion(apiVersion)
                                                    .filter(
                                                        '_type == "page" && pageType == "page"',
                                                    ),
                                            ),
                                        S.listItem()
                                            .title('Legal')
                                            .icon(Scale)
                                            .child(
                                                S.documentList()
                                                    .title('Legal Pages')
                                                    .apiVersion(apiVersion)
                                                    .filter(
                                                        '_type == "page" && pageType == "legal"',
                                                    ),
                                            ),
                                    ]),
                            ),
                        S.divider(),
                        ...S.documentTypeListItems().filter(
                            (item) => item.getId() !== 'page',
                        ),
                    ]),
        }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
        // presentationTool({
        //     name: 'preview',
        //     title: 'Preview',
        //     previewUrl: `${baseURL}/api/preview/enable`,
        // }),
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

export default config
