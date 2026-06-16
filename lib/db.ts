import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  }
  return pool
}
