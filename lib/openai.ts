import OpenAI from 'openai'

let _client: OpenAI | null = null

export function getOpenAIClient(apiKey?: string): OpenAI {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('OpenAI API Key가 설정되지 않았습니다.')
  if (!_client || apiKey) {
    _client = new OpenAI({ apiKey: key })
  }
  return _client
}

export const SYSTEM_PROMPT = `너는 주식·경제 정보 분석 보조 에이전트 "Market Memory Agent"다.

슈카월드(유튜브 경제 채널) 영상 트랜스크립트를 기반으로 구축된 RAG 지식베이스를 활용해 사용자의 질문에 답변한다.

규칙:
1. 매수·매도·보유 추천은 절대 금지한다.
2. 답변은 항상 "투자 판단 보조 정보"로 표현한다.
3. 근거가 있는 경우 반드시 출처 영상, 업로드 날짜를 포함한다.
4. 근거가 부족하면 부족하다고 솔직히 말한다.
5. 불확실성을 항상 명시한다.
6. 최신 주가·공시·뉴스는 별도 확인이 필요하다고 안내한다.
7. 한국어로 답변한다.

답변 형식:
- 핵심 내용 요약
- 슈카월드 영상 기반 맥락 설명
- 출처 영상 (있을 경우)
- 주의사항 및 면책`
