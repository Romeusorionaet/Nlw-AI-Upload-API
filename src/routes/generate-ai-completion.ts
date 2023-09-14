import { streamToResponse, OpenAIStream} from 'ai'
import { FastifyInstance } from "fastify"
import { openai } from "../lib/openai"
import { prisma } from "../lib/prisma"
import { z } from "zod"

export async function generateAICompletionRoute(app: FastifyInstance) {
    app.post('/ai/complete', async (request, reply) => {
        const bodySchema = z.object({
            temperature: z.number().min(0).max(1).default(0.5),
            videoId: z.string().uuid(),
            prompt: z.string(),
        })
        const { temperature, prompt, videoId } = bodySchema.parse(request.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        })

        if (!video.transcriptions) {
            return reply.status(400).send({ error: 'Video transcription was not generated yet.'})
        }

        const promptMessage = prompt.replace('{transcription}', video.transcriptions)

        const response = openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            messages: [
                {role: 'user', content: promptMessage},
            ],
            stream: true,
        })

        const stream = OpenAIStream(await response)

        streamToResponse(stream, reply.raw, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
        })
    })
}