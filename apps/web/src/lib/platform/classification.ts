import { generateObject, type LanguageModelUsage } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import type { DocumentMetadata } from '@repo/db/schema'
import {
    DATASET_CATEGORIES,
    DATASET_TAGS,
    datasetCategorySchema,
} from '@/lib/constants/dataset-taxonomy'
import { buildDatasetContextBlock } from './dataset-prompt'

// `tags` is free-text (constrained only by the prompt), not a closed z.enum —
// Gemini's structured-output API rejects enums with this many values ("too
// much branching for serving"). We validate against DATASET_TAGS afterward.
const classificationSchema = z.object({
    category: datasetCategorySchema,
    tags: z.array(z.string()).min(1).max(6),
})

const VALID_TAGS = new Set<string>(DATASET_TAGS)

export async function classifyDataset(
    name: string,
    meta: DocumentMetadata,
    aiInsights?: string | null,
): Promise<{
    category: string
    tags: string[]
    usage: LanguageModelUsage
}> {
    const contextBlock = buildDatasetContextBlock({ name, meta })
    const categoryList = DATASET_CATEGORIES.map((c) => `${c.value} (${c.label})`).join(', ')
    const tagList = DATASET_TAGS.join(', ')

    const { object, usage } = await generateObject<z.infer<typeof classificationSchema>>({
        model: google('gemini-2.5-flash'),
        schema: classificationSchema,
        prompt: `You are classifying a dataset for a data marketplace so it can be browsed by category and tag.

${contextBlock}
${aiInsights ? `\nExisting AI-generated summary of this dataset:\n${aiInsights}\n` : ''}

Pick exactly one category from this fixed list (use the value, not the label): ${categoryList}

Then pick 2-6 tags from this fixed vocabulary that best describe the dataset's subject matter (values only, no new tags): ${tagList}`,
    })

    const tags = [...new Set(object.tags)].filter((tag) => VALID_TAGS.has(tag))

    return { category: object.category, tags, usage }
}
