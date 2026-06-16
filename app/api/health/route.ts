import { NextResponse } from 'next/server'

async function checkOpenAI(): Promise<{ ok: boolean; latency: number; detail: string }> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return { ok: false, latency: 0, detail: 'API Key 미설정' }
  const start = Date.now()
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    })
    const latency = Date.now() - start
    if (!res.ok) return { ok: false, latency, detail: `HTTP ${res.status}` }
    const data = await res.json()
    const count = data.data?.length ?? 0
    return { ok: true, latency, detail: `모델 ${count}개 확인됨` }
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, detail: e.message ?? '연결 실패' }
  }
}

async function checkElevenLabs(): Promise<{ ok: boolean; latency: number; detail: string }> {
  const key = process.env.ELEVENLABS_API_KEY
  if (!key) return { ok: false, latency: 0, detail: 'API Key 미설정' }
  const start = Date.now()
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': key },
      signal: AbortSignal.timeout(8000),
    })
    const latency = Date.now() - start
    if (!res.ok) return { ok: false, latency, detail: `HTTP ${res.status}` }
    const data = await res.json()
    const remaining = data.subscription?.character_limit - data.subscription?.character_count
    return { ok: true, latency, detail: `잔여 ${remaining?.toLocaleString() ?? '-'}자` }
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, detail: e.message ?? '연결 실패' }
  }
}

async function checkYouTube(): Promise<{ ok: boolean; latency: number; detail: string }> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return { ok: false, latency: 0, detail: 'API Key 미설정' }
  const start = Date.now()
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCJ3NSmGMEUGm4eBPBrIJHMQ&key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const latency = Date.now() - start
    if (!res.ok) return { ok: false, latency, detail: `HTTP ${res.status}` }
    const data = await res.json()
    const title = data.items?.[0]?.snippet?.title ?? '채널 확인됨'
    return { ok: true, latency, detail: title }
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, detail: e.message ?? '연결 실패' }
  }
}

async function checkDatabase(): Promise<{ ok: boolean; latency: number; detail: string }> {
  const url = process.env.DATABASE_URL
  if (!url) return { ok: false, latency: 0, detail: 'DATABASE_URL 미설정' }
  const start = Date.now()
  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    const latency = Date.now() - start
    return { ok: true, latency, detail: 'PostgreSQL 연결 성공' }
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, detail: e.message?.split('\n')[0] ?? '연결 실패' }
  }
}

export async function GET() {
  const [openai, elevenlabs, youtube, database] = await Promise.all([
    checkOpenAI(),
    checkElevenLabs(),
    checkYouTube(),
    checkDatabase(),
  ])

  const services = { openai, elevenlabs, youtube, database }
  const allOk = Object.values(services).every((s) => s.ok)

  return NextResponse.json({
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services,
  })
}
