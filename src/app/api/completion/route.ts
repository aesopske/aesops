import { HfInference } from '@huggingface/inference'
import { HuggingFaceStream, StreamingTextResponse } from 'ai'

// create new huggingface Inference instance
const hf = new HfInference(process.env.HUGGINGFACE_ACCESS_TOKEN)

export const runtime = 'edge'

export async function POST(req: Request) {
    // get the message from the body
    const { prompt } = await req.json()

    const response = hf.textGenerationStream({
        model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: `<|prompter|>${prompt}<|endoftext|><|assistant|>`,
        parameters: {
            max_new_tokens: 200,
            // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false,
        },
    })

    // convert the response to a stream
    const stream = HuggingFaceStream(response)

    // return the stream
    return new StreamingTextResponse(stream)
}
