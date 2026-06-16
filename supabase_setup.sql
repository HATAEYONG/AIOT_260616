-- pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable: videos
CREATE TABLE IF NOT EXISTS "videos" (
    "id" TEXT NOT NULL,
    "youtube_video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "duration" TEXT,
    "thumbnail_url" TEXT,
    "view_count" INTEGER,
    "description" TEXT,
    "transcript_status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "videos_youtube_video_id_key" ON "videos"("youtube_video_id");

-- CreateTable: transcripts
CREATE TABLE IF NOT EXISTS "transcripts" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "full_text" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ko',
    "source_type" TEXT NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "transcripts_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE
);

-- CreateTable: chunks (vector 타입으로 embedding 저장)
CREATE TABLE IF NOT EXISTS "chunks" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "transcript_id" TEXT,
    "chunk_index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "embedding" vector(1536),
    "topics" TEXT[],
    "entities" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chunks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chunks_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE,
    CONSTRAINT "chunks_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "transcripts"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "chunks_embedding_idx" ON "chunks" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

-- CreateTable: agent_logs
CREATE TABLE IF NOT EXISTS "agent_logs" (
    "id" TEXT NOT NULL,
    "agent_type" TEXT NOT NULL,
    "input" TEXT,
    "output" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "error_message" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agent_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: api_keys
CREATE TABLE IF NOT EXISTS "api_keys" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_keys_provider_key" ON "api_keys"("provider");

-- CreateTable: chat_sessions
CREATE TABLE IF NOT EXISTS "chat_sessions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: chat_messages
CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sources" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
);

-- RAG 벡터 유사도 검색 함수
CREATE OR REPLACE FUNCTION search_chunks(
    query_embedding vector(1536),
    match_count int DEFAULT 5,
    match_threshold float DEFAULT 0.7
)
RETURNS TABLE (
    id text,
    video_id text,
    text text,
    start_time text,
    end_time text,
    topics text[],
    entities text[],
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT
        c.id,
        c.video_id,
        c.text,
        c.start_time,
        c.end_time,
        c.topics,
        c.entities,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM chunks c
    WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
$$;
