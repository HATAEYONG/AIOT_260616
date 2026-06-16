import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
import { chunkAndEmbed } from '@/lib/rag'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { youtubeVideoId, title, url, publishedAt, transcript, thumbnailUrl, duration } = body

  if (!youtubeVideoId || !title || !url || !transcript) {
    return NextResponse.json({ error: 'youtubeVideoId, title, url, transcript 필수' }, { status: 400 })
  }

  const pool = getPool()

  const videoRes = await pool.query(
    `INSERT INTO videos (id, youtube_video_id, title, url, published_at, thumbnail_url, duration, transcript_status, updated_at)
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, 'processing', NOW())
     ON CONFLICT (youtube_video_id) DO UPDATE SET title=$2, url=$3, transcript_status='processing', updated_at=NOW()
     RETURNING id`,
    [youtubeVideoId, title, url, publishedAt || null, thumbnailUrl || null, duration || null]
  )
  const videoId = videoRes.rows[0].id

  const transcriptRes = await pool.query(
    `INSERT INTO transcripts (id, video_id, full_text, language, source_type)
     VALUES (gen_random_uuid()::text, $1, $2, 'ko', 'manual')
     RETURNING id`,
    [videoId, transcript]
  )
  const transcriptId = transcriptRes.rows[0].id

  await pool.query(
    `DELETE FROM chunks WHERE video_id = $1`,
    [videoId]
  )

  await chunkAndEmbed(videoId, transcriptId, transcript)

  await pool.query(
    `UPDATE videos SET transcript_status='completed', updated_at=NOW() WHERE id=$1`,
    [videoId]
  )

  const { rows: chunkRows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM chunks WHERE video_id=$1`, [videoId]
  )

  return NextResponse.json({
    success: true,
    videoId,
    transcriptId,
    chunkCount: parseInt(chunkRows[0].cnt),
    message: `"${title}" 영상 임베딩 완료`,
  })
}
