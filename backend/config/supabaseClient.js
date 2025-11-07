// backend/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY)?.trim()

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ SUPABASE_URL belum di-set dengan benar. Contoh: https://xxx.supabase.co')
  console.error('📝 Silakan buat file .env di folder backend dan isi dengan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY')
  throw new Error('SUPABASE_URL is required. Please create a .env file with your Supabase credentials.')
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY belum di-set')
  console.error('📝 Silakan buat file .env di folder backend dan isi dengan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY')
  throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY is required. Please create a .env file with your Supabase credentials.')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default supabase
