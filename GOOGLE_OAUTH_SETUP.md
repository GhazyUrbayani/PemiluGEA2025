# Google OAuth Setup - PEMILU GEA 2025

## 🔧 Setup Google OAuth Credentials

### 1. Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan akun Google Anda
3. Klik **Select a project** → **New Project**
4. Nama project: `PEMILU GEA 2025`
5. Klik **Create**

### 2. Enable Google+ API

1. Di dashboard project, pergi ke **APIs & Services** → **Library**
2. Cari: `Google+ API`
3. Klik dan **Enable**

### 3. Configure OAuth Consent Screen

1. Pergi ke **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk user di luar organisasi)
3. Klik **Create**

**App Information**:
- App name: `PEMILU GEA 2025`
- User support email: email panitia
- Application home page: `http://localhost:3000` (development) atau domain production
- Authorized domains: `students.itb.ac.id` (untuk restrict ke domain ITB saja)
- Developer contact: email panitia

4. Klik **Save and Continue**

**Scopes** (Step 2):
- Add scope: `email`, `profile`, `openid`
- Klik **Save and Continue**

**Test users** (Step 3):
- Tambahkan email untuk testing (opsional)
- Klik **Save and Continue**

5. Klik **Back to Dashboard**

### 4. Create OAuth Credentials

1. Pergi ke **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `PEMILU GEA 2025 Web Client`

**Authorized JavaScript origins**:
```
http://localhost:3000
https://your-production-domain.com
```

**Authorized redirect URIs**:
```
http://localhost:3000/api/auth/callback/google
https://your-production-domain.com/api/auth/callback/google
```

5. Klik **Create**
6. **COPY** Client ID dan Client Secret

### 5. Update Environment Variables

Edit `.env.local`:
```bash
# Google OAuth (untuk SSO pemilih online)
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcd1234efgh5678ijkl"
```

⚠️ **PENTING**: Jangan commit `.env.local` ke Git! File ini sudah ada di `.gitignore`

### 6. Restart Development Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 🔒 Domain Restriction (Opsional)

Untuk restrict login hanya untuk email `@students.itb.ac.id`:

**Option 1: Di Google Cloud Console**
- OAuth consent screen → Authorized domains → Tambah `students.itb.ac.id`

**Option 2: Di Code** (sudah implemented di `lib/auth-options.ts`)
```typescript
// Validasi email harus dari domain ITB
if (!email.endsWith('@students.itb.ac.id')) {
  console.error('Email bukan dari domain ITB');
  return false;
}
```

## 🧪 Testing

### Test Google Login
1. Buka `http://localhost:3000/auth/sign-in`
2. Klik **Login dengan Google**
3. Pilih akun Google ITB (`@students.itb.ac.id`)
4. Authorize aplikasi
5. ✅ Redirect ke `/vote`

### Troubleshooting

**Error: "redirect_uri_mismatch"**
- Periksa redirect URI di Google Console match dengan aplikasi
- Format harus exact: `http://localhost:3000/api/auth/callback/google`

**Error: "access_denied"**
- User membatalkan authorization
- Atau email tidak ada di DPT

**Error: "invalid_client"**
- Client ID atau Client Secret salah
- Periksa .env.local

## 📊 Token Format

### Voter Token (Offline)
- **Format**: 5-7 digit angka saja
- **Contoh**: `12345`, `9876543`, `00123`
- **Generate**: Otomatis saat import DPT
- **Hash**: bcrypt dengan salt 10

### Admin Token
- **Format**: String alphanumeric
- **Default**: `pemilskuy`
- **Hash**: bcrypt dengan salt 10
- **Stored**: Database table `admin_tokens`

## 🔄 Migration dari Azure AD

Perubahan yang sudah dilakukan:

1. ✅ Provider: Azure AD → Google OAuth
2. ✅ Token voter: 64 char hex → 5-7 digit angka
3. ✅ UI: Microsoft logo → Google logo
4. ✅ Callback: `azure-ad` → `google`
5. ✅ Environment: `AZURE_AD_*` → `GOOGLE_*`

## 📝 Notes

- Google OAuth gratis untuk unlimited users
- Rate limit: 10,000 requests per day (cukup untuk PEMILU)
- Token refresh otomatis oleh NextAuth
- Session timeout: 1 jam (sesuai durasi voting)
- Multi-device login: Allowed (1 email = 1 vote regardless of device)

---

**Last Updated**: November 29, 2025
**System**: PEMILU GEA 2025 - Google OAuth Integration
