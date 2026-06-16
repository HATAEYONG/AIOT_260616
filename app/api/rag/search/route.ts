import { NextRequest, NextResponse } from 'next/server'
import { ragSearch } from '@/lib/rag'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query) return NextResponse.json({ error: 'query 필수' }, { status: 400 })

  const result = await ragSearch(query)
  return NextResponse.json(result)
}
