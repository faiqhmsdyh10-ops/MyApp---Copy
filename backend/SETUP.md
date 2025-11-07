# Setup Supabase untuk Backend

## Masalah Error 500 saat Registrasi

Jika Anda mendapatkan error 500 saat registrasi, kemungkinan besar Anda menggunakan **anon/public key** bukan **service_role key**.

## Solusi

### 1. Dapatkan Service Role Key dari Supabase Dashboard

1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Pergi ke **Settings** > **API**
4. Scroll ke bagian **Project API keys**
5. **JANGAN** gunakan "anon public" key
6. **SALIN** "service_role" key (yang biasanya disembunyikan, klik "Reveal" untuk melihat)

### 2. Update File .env

Edit file `.env` di folder `backend`:

```env
SUPABASE_URL=https://mpntmmfmqlllmsbyvox.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_service_role_key_di_sini
PORT=5000
```

**PENTING:**
- Gunakan `SUPABASE_SERVICE_ROLE_KEY` (bukan `SUPABASE_KEY`)
- Service role key dimulai dengan `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` dan panjangnya sekitar 200+ karakter
- JANGAN commit file `.env` ke git (sudah ada di .gitignore)

### 3. Restart Server

Setelah update `.env`, **restart server backend**:

```bash
# Stop server (Ctrl+C)
# Kemudian start lagi
cd backend
node server.js
```

### 4. Verifikasi

Setelah restart, coba registrasi lagi. Jika masih error, cek:
- Apakah service_role key sudah benar?
- Apakah tabel `users` sudah dibuat di Supabase?
- Apakah RLS (Row Level Security) sudah dikonfigurasi dengan benar?

## Perbedaan Anon Key vs Service Role Key

| Key Type | Role | Akses |
|----------|------|-------|
| **anon/public** | `anon` | Terbatas oleh RLS policy, tidak bisa bypass |
| **service_role** | `service_role` | Full access, bypass RLS, untuk backend/admin |

**Untuk backend, WAJIB menggunakan service_role key!**

## Troubleshooting

### Error: "fetch failed"
- Periksa koneksi internet
- Pastikan URL Supabase benar
- Pastikan tidak ada firewall yang memblokir

### Error: "JWT expired" atau "Invalid JWT"
- Key yang digunakan salah
- Pastikan menggunakan service_role key yang valid

### Error: "permission denied" atau error code 42501
- Menggunakan anon key bukan service_role key
- Update .env dengan service_role key

### Error: "relation users does not exist" atau error code 42P01
- Tabel `users` belum dibuat di Supabase
- Buat tabel melalui SQL Editor atau Table Editor di Supabase Dashboard

