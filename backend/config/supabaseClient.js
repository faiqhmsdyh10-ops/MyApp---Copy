// backend/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY)?.trim()

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ SUPABASE_URL belum di-set dengan benar. Contoh: https://xxx.supabase.co')
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY belum di-set')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default supabase
