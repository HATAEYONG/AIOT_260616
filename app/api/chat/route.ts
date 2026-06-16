import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/openai'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'OpenAI API Key가 설정되지 않았습니다. 관리자 설정에서 등록해주세요.' }, { status: 400 })
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
