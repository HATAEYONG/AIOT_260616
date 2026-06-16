import OpenAI from 'openai'
import { getPool } from './db'

export interface ChunkResult {
  id: string
  video_id: string
  text: string
  start_time: string | null
  end_time: string | null
  topics: string[]
  entities: string[]
  similarity: number
  video_title?: string
  video_url?: string
  published_at?: string
}

export async function getEmbedding(text: string, apiKey?: string): Promise<number[]> {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('OpenAI API Key 없음')

  const client = new OpenAI({ apiKey: key })
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),
  })
  return res.data[0].embedding
}

export async function searchChunks(
  queryEmbedding: number[],
  matchCount = 5,
  matchThreshold = 0.5
): Promise<ChunkResult[]> {
  const pool = getPool()
  const vectorStr = `[${queryEmbedding.join(',')}]`

  const { rows } = await pool.query(
    `SELECT
       c.id, c.video_id, c.text, c.start_time, c.end_time, c.topics, c.entities,
       1 - (c.embedding <=> $1::vector) AS similarity,
       v.title AS video_title, v.url AS video_url, v.published_at
     FROM chunks c
     JOIN videos v ON v.id = c.video_id
     WHERE 1 - (c.embedding <=> $1::vector) > $3
     ORDER BY c.embedding <=> $1::vector
     LIMIT $2`,
    [vectorStr, matchCount, matchThreshold]
  )
  return rows
}

export async function ragSearch(query: string): Promise<{
  chunks: ChunkResult[]
  sourcesText: string
}> {
  try {
    const embedding = await getEmbedding(query)
    const chunks = await searchChunks(embedding, 5, 0.5)

    if (chunks.length === 0) {
      return { chunks: [], sourcesText: '' }
    }

    const sourcesText = chunks
      .map((c, i) => {
        const date = c.published_at ? new Date(c.published_at).toLocaleDateString('ko-KR') : ''
        const time = c.start_time ? ` (${c.start_time})` : ''
        return `[출처 ${i + 1}] ${c.video_title} ${date}${time}\n${c.text}`
      })
      .join('\n\n---\n\n')

    return { chunks, sourcesText }
  } catch {
    return { chunks: [], sourcesText: '' }
  }
}

export async function chunkAndEmbed(
  videoId: string,
  transcriptId: string,
  fullText: string,
  chunkSize = 800,
  overlap = 150
): Promise<void> {
  const pool = getPool()
  const chunks: string[] = []
  let start = 0

  while (start < fullText.length) {
    const end = Math.min(start + chunkSize, fullText.length)
    chunks.push(fullText.slice(start, end))
    start += chunkSize - overlap
  }

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i]
    const embedding = await getEmbedding(text)
    const vectorStr = `[${embedding.join(',')}]`

    await pool.query(
      `INSERT INTO chunks (id, video_id, transcript_id, chunk_index, text, embedding, topics, entities)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5::vector, $6, $7)
       ON CONFLICT DO NOTHING`,
      [videoId, transcriptId, i, text, vectorStr, [], []]
    )
  }
}
