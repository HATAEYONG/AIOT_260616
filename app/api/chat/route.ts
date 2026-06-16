import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { ragSearch } from '@/lib/rag'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const BASE_SYSTEM = `너는 주식·경제 정보 분석 보조 에이전트 "Market Memory Agent"다.
슈카월드(유튜브 경제 채널) 영상 트랜스크립트를 기반으로 구축된 RAG 지식베이스를 활용해 사용자의 질문에 답변한다.

규칙:
1. 매수·매도·보유 추천은 절대 금지한다.
2. 답변은 항상 "투자 판단 보조 정보"로 표현한다.
3. 근거가 있으면 반드시 출처 영상, 날짜를 포함한다.
4. 근거가 부족하면 솔직히 말한다.
5. 불확실성을 항상 명시한다.
6. 최신 주가·공시·뉴스는 별도 확인 필요하다고 안내한다.
7. 한국어로 답변한다.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'OpenAI API Key가 설정되지 않았습니다.' }, { status: 400 })
  }

  const lastUserMessage = messages.findLast((m: { role: string }) => m.role === 'user')?.content ?? ''

  const { chunks, sourcesText } = await ragSearch(lastUserMessage)

  let systemPrompt: string

  if (sourcesText && chunks.length > 0) {
    const sourceList = chunks.map((c, i) => {
      const date = c.published_at ? new Date(c.published_at).toLocaleDateString('ko-KR') : ''
      const time = c.start_time ? ` (${c.start_time})` : ''
      return `${i + 1}. [${c.video_title}](${c.video_url}) ${date}${time}`
    }).join('\n')

    systemPrompt = `${BASE_SYSTEM}

아래는 슈카월드 영상에서 검색된 관련 내용이다. 이 내용을 근거로 답변하라:

${sourcesText}

답변 마지막에 반드시 출처 영상 목록을 포함하라:

📹 참고 영상
${sourceList}`
  } else {
    systemPrompt = `${BASE_SYSTEM}

현재 슈카월드 영상 지식베이스에 관련 내용이 없거나 아직 데이터가 수집되지 않았다.
일반적인 경제·투자 지식을 바탕으로 답변하되, 슈카월드 기반 근거는 제공할 수 없음을 명시하라.`
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
