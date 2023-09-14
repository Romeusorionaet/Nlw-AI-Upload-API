import { generateAICompletionRoute } from './routes/generate-ai-completion'
import { createTranscriptionRoute } from './routes/create-transcription'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

const app = fastify()

app.register(fastifyCors, {
    origin: '*',
})

app.register(generateAICompletionRoute)
app.register(createTranscriptionRoute)
app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running! Port: 3333')
})