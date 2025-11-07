// backend/config/supabaseClient.js
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const buildConfig = () => {
  if (process.env.SUPABASE_CONNECTION_STRING) {
    return {
      connectionString: process.env.SUPABASE_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
    }
  }

  return {
    host: process.env.SUPABASE_HOST,
    port: process.env.SUPABASE_PORT,
    database: process.env.SUPABASE_DB,
    user: process.env.SUPABASE_USER,
    password: process.env.SUPABASE_PASSWORD,
    ssl: { rejectUnauthorized: false }
  }
}

const pool = new Pool(buildConfig())

pool.on('connect', () => {
  console.log('✅ Terhubung ke database Supabase Postgres')
})

pool.on('error', (err) => {
  console.error('❌ Pool database error:', err)
})

export default pool
