import { NextRequest, NextResponse } from 'next/server'
import { encrypt, decrypt, maskKey } from '@/lib/encryption'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234'

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-password')
  return auth === ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const providers = ['openai', 'elevenlabs', 'youtube']
  const result: Record<string, { isSet: boolean; masked: string }> = {}

  for (const provider of providers) {
    const envMap: Record<string, string> = {
      openai: 'OPENAI_API_KEY',
      elevenlabs: 'ELEVENLABS_API_KEY',
      youtube: 'YOUTUBE_API_KEY',
    }
    const val = process.env[envMap[provider]]
    result[provider] = {
      isSet: !!val,
      masked: val ? maskKey(val) : '',
    }
  }

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { provider, apiKey } = body

  if (!provider || !apiKey) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  return NextResponse.json({ 
    success: true, 
    message: `${provider} API Key가 확인되었습니다. Vercel 환경변수에서 설정해주세요.`,
    masked: maskKey(apiKey)
  })
}
