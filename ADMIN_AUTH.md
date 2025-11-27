# Admin Authentication - Token-Based System

## Overview
Sistem autentikasi admin telah diubah dari username/password menjadi **token-based authentication** yang lebih sederhana dan aman. Token admin disimpan di database Supabase (tidak di-hardcode di code) untuk keamanan repository public.

## Setup Admin Token

### 1. Set Environment Variable
Tambahkan admin token ke file `.env.local`:
```env
ADMIN_TOKEN="your-secret-admin-token-here"
```

⚠️ **PENTING**: 
- Jangan hardcode token di code karena repo GitHub adalah public!
- File `.env.local` sudah ada di `.gitignore` dan tidak akan ter-push ke GitHub
- Token ini akan di-hash sebelum disimpan ke database

### 2. Run Migration
Drop tabel `admins` lama dan create tabel `admin_tokens` baru:
```bash
npx tsx db/migrations/apply-migration.ts
```

### 3. Seed Admin Token
Insert admin token pertama kali ke database (dari environment variable):
```bash
npx tsx db/seed/seed-admin-token.ts
```

Jika ingin insert ulang (force):
```bash
npx tsx db/seed/seed-admin-token.ts --force
```

## Login sebagai Admin

1. Buka halaman login: `/auth/sign-in`
2. Scroll ke bagian **"Login dengan Token"**
3. Masukkan token admin Anda (value dari `ADMIN_TOKEN`)
4. Klik **"Login dengan Token"**
5. Sistem akan otomatis redirect ke `/hasil` jika token valid

## Cara Kerja

### Database Schema
Tabel `admin_tokens` memiliki struktur:
```sql
CREATE TABLE admin_tokens (
  id VARCHAR(256) PRIMARY KEY,
  token_hash VARCHAR(256) NOT NULL UNIQUE,  -- Bcrypt hash dari token
  name TEXT NOT NULL,                       -- Nama admin atau deskripsi
  is_active BOOLEAN DEFAULT true,           -- Status aktif/nonaktif
  created_at TIMESTAMP DEFAULT now(),
  last_used_at TIMESTAMP                    -- Track kapan terakhir login
);
```

### Authentication Flow

1. **User memasukkan token** di form login
2. **Backend validates token**:
   - Cek apakah token match dengan admin token (via bcrypt compare)
   - Jika match → set cookie `admin-session` dan redirect ke `/hasil`
   - Jika tidak match → cek apakah token voter (existing flow)
3. **Admin session** disimpan di cookie dengan durasi 8 jam
4. **Halaman `/hasil`** verify session via API `/api/auth/check-admin`

### Session Cookies
Saat admin login berhasil, cookies berikut di-set:
- `admin-session`: ID admin token (UUID)
- `user-role`: "admin"
- Duration: 8 hours
- HttpOnly, Secure (production), SameSite: lax

## Security Features

✅ **Token tidak di-hardcode** di code (ambil dari env variable)
✅ **Token di-hash** sebelum disimpan ke database (bcrypt dengan salt rounds 12)
✅ **Session-based** dengan cookie HttpOnly
✅ **Token permanen** (tidak expire kecuali dihapus manual dari database)
✅ **Environment file** (.env.local) tidak ter-push ke GitHub
✅ **Public repo safe** - tidak ada sensitive data di code

## Manage Admin Tokens

### Nonaktifkan Token (tanpa delete)
```sql
UPDATE admin_tokens 
SET is_active = false 
WHERE id = 'token-id-here';
```

### Hapus Token Permanent
```sql
DELETE FROM admin_tokens 
WHERE id = 'token-id-here';
```

### Lihat Semua Admin Tokens
```sql
SELECT id, name, is_active, created_at, last_used_at 
FROM admin_tokens;
```

### Tambah Admin Token Baru (Manual)
```typescript
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const newToken = "your-new-token-here";
const tokenHash = await hash(newToken, 12);

await db.insert(adminTokens).values({
  id: uuidv4(),
  tokenHash: tokenHash,
  name: "Admin Name or Description",
  isActive: true,
});
```

## Unified Login Form

Form login di `/auth/sign-in` sekarang mendukung 3 metode:
1. **Microsoft SSO** (untuk pemilih online) → redirect ke `/vote`
2. **Voter Token** (untuk pemilih offline) → redirect ke `/vote`
3. **Admin Token** (untuk panitia) → redirect ke `/hasil`

Sistem otomatis detect jenis token dan redirect ke halaman yang sesuai.

## Migration from Old System

### Old System (Before)
- Table: `admins` dengan email + password
- Login: NextAuth dengan credentials provider
- Session: NextAuth session dengan role "admin"

### New System (After)
- Table: `admin_tokens` dengan token_hash permanen
- Login: Token-based via `/api/auth/login-token`
- Session: Cookie-based dengan `admin-session` dan `user-role`

### Breaking Changes
- **Removed**: Table `admins`
- **Removed**: NextAuth admin authentication
- **Removed**: `useSession()` untuk check admin role
- **Added**: Token-based admin authentication
- **Added**: `/api/auth/check-admin` endpoint
- **Added**: Admin token management via database

## Troubleshooting

### Token tidak valid
- Pastikan token di `.env.local` sama dengan yang Anda masukkan
- Cek apakah token sudah di-seed ke database
- Verifikasi dengan query: `SELECT * FROM admin_tokens WHERE is_active = true;`

### Redirect ke login terus
- Clear browser cookies
- Cek console browser untuk error messages
- Verifikasi API `/api/auth/check-admin` response

### Token tidak ter-hash
- Pastikan bcrypt installed: `npm install bcrypt`
- Re-run seed script: `npx tsx db/seed/seed-admin-token.ts --force`

## Best Practices

1. **Ganti token default** di production
2. **Jangan share token** di public channels
3. **Rotate token** secara berkala untuk keamanan
4. **Monitor `last_used_at`** untuk detect unauthorized access
5. **Set `is_active = false`** untuk nonaktifkan token tanpa delete
6. **Backup database** sebelum delete atau update token

## Support

Jika ada masalah atau pertanyaan:
1. Check logs di console browser dan server
2. Verify database dengan query SQL
3. Re-run migration dan seed jika perlu
4. Contact panitia PEMILU GEA 2025
