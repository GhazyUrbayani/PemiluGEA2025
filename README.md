# 🗳️ PEMILU GEA 2025

Sistem voting online untuk Pemilihan Umum Himpunan Mahasiswa Teknik Geologi (GEA) ITB 2025 dengan tema Star Wars.

## 🔑 Testing dengan Token Dummy

**Untuk development/testing, gunakan salah satu token dummy ini:**

- `TESTTOKEN123`
- `DUMMYTOKEN456`
- `DEVTOKEN789`

### Cara Testing:

1. Jalankan `npm run dev`
2. Buka [http://localhost:3000/auth/sign-in](http://localhost:3000/auth/sign-in)
3. Scroll ke "Untuk Pemilih Offline"
4. Masukkan token dummy
5. Test voting dengan drag & drop!

⚠️ **HAPUS semua kode dummy sebelum production!**

## 🎯 Fitur Utama

- **Hybrid Login System**: Mendukung login dengan Microsoft SSO (online) dan Token (offline)
- **Drag & Drop Voting**: Interface voting dengan drag-and-drop untuk ranking kandidat
- **Instant Runoff Voting (IRV)**: Sistem pemilihan dengan preferensi ranking
- **Anonymous Ballot Box**: Arsitektur "kotak suara terpisah" untuk menjaga anonimitas pemilih
- **End-to-End Encryption**: Data suara terenkripsi dengan AES-256-GCM
- **DPT Validation**: Validasi otomatis Daftar Pemilih Tetap
- **Star Wars Theme**: UI dengan tema Star Wars lengkap dengan warna dan font khas

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js dengan Azure AD Provider
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Encryption**: Node.js Crypto (AES-256-GCM)

## 📁 Struktur Project

```
PEMILU-Gea2025/
├── app/                    # Next.js App Router
│   ├── auth/              # Halaman login & authentication
│   ├── vote/              # Halaman voting (TODO)
│   ├── admin/             # Dashboard admin (TODO)
│   └── api/               # API routes
│       ├── auth/          # Authentication endpoints
│       └── vote/          # Voting endpoints (TODO)
├── components/            # React components
│   ├── CandidateCard.tsx # Komponen kartu kandidat
│   └── ui/               # shadcn/ui components
├── db/                   # Database
│   ├── schema.ts         # Drizzle schema (NEW)
│   └── seed/            # Seed scripts
├── lib/                  # Utility functions
│   ├── encryption.ts    # Enkripsi/dekripsi (NEW)
│   ├── irv-new.ts       # IRV algorithm (NEW)
│   └── auth-options.ts  # NextAuth config (UPDATED)
├── public/              # Static assets
│   └── images/logos/   # Logo files
└── types/              # TypeScript types
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (bisa pakai [Neon](https://neon.tech))
- Azure AD App Registration (untuk SSO)

### Installation

1. **Clone repository**

```bash
git clone <repo-url>
cd PEMILU-Gea2025
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi:

- `DATABASE_URL`: Connection string PostgreSQL
- `NEXTAUTH_SECRET`: Generate dengan `openssl rand -base64 32`
- `AZURE_AD_CLIENT_ID` & `AZURE_AD_CLIENT_SECRET`: Dari Azure Portal
- `VOTE_ENCRYPTION_KEY`: Generate dengan `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Setup database**

```bash
# Push schema ke database
npm run db:push

# Seed kandidat (setelah data siap)
npx tsx db/seed/seed-candidates.ts

# Import DPT
npx tsx db/seed/import-dpt.ts path/to/dpt.csv

# Generate token offline (jika perlu)
npx tsx db/seed/generate-offline-tokens.ts path/to/offline-voters.csv
```

5. **Run development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📚 Dokumentasi Lengkap

Lihat file-file berikut untuk dokumentasi detail:

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**: Panduan implementasi lengkap
- **[.env.example](./.env.example)**: Konfigurasi environment variables
- **Database Schema**: `db/schema.ts`
- **Encryption**: `lib/encryption.ts`
- **IRV Algorithm**: `lib/irv-new.ts`

## 🔐 Keamanan

### Prinsip Keamanan Utama

1. **Anonimitas Terjaga**: Tidak ada link antara `ballot_box` dan `voter_registry`
2. **Enkripsi End-to-End**: Semua data suara terenkripsi sebelum disimpan
3. **Token Hashing**: Token offline di-hash dengan SHA-256
4. **DPT Validation**: Validasi otomatis di level authentication
5. **Audit Trail**: Timestamp untuk setiap vote tanpa identitas pemilih

### Environment Variables yang Sensitif

⚠️ **JANGAN PERNAH COMMIT:**

- `VOTE_ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`
- `AZURE_AD_CLIENT_SECRET`
- `DATABASE_URL`

## 🎓 Untuk Developer

### Yang Sudah Dibuat

✅ Database schema dengan arsitektur "kotak suara terpisah"
✅ Hybrid login system (SSO + Token)
✅ Encryption utility untuk ballot
✅ NextAuth configuration dengan DPT validation
✅ IRV algorithm baru
✅ Komponen UI dasar
✅ Seed scripts untuk kandidat dan DPT

### Yang Perlu Dilengkapi

⚠️ **High Priority:**

1. **Voting Page** (`app/vote/page.tsx`)

   - Drag-and-drop interface untuk ranking kandidat
   - Opsi "Kotak Kosong"
   - Form submission
   - Library: `@dnd-kit/core`, `@dnd-kit/sortable`

2. **Vote Submission API** (`app/api/vote/submit/route.ts`)

   - Validasi session
   - Enkripsi ballot
   - Simpan ke `ballot_box`
   - Update `voter_registry`

3. **Admin Results Page** (`app/admin/results/page.tsx`)

   - Dashboard untuk melihat hasil
   - Dekripsi & hitung IRV
   - Export CSV
   - Protected route

4. **Data Kandidat**

   - Upload foto kandidat ke `public/candidates/`
   - Update `seed-candidates.ts` dengan data real
   - Run seed script

5. **Logo Files**
   - Upload `logo-pemilu-gea-2025.svg`
   - Upload `logo-gea-itb.svg`
   - Upload `microsoft-logo.svg`

### Development Workflow

1. Branch dari `main`
2. Develop fitur
3. Test locally
4. PR dengan deskripsi lengkap
5. Review & merge

### Testing Checklist

- [ ] Login dengan Microsoft SSO
- [ ] Login dengan token offline
- [ ] Validasi DPT (reject jika not eligible)
- [ ] Voting dengan ranking
- [ ] Submit vote (encrypted)
- [ ] Cek `hasVoted` updated
- [ ] Admin view results
- [ ] IRV calculation correct
- [ ] Export CSV

## 🚢 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Set environment variables
4. Deploy
5. Update Azure AD Redirect URI dengan URL production

### Database Migration

```bash
# Development
npm run db:push

# Production (dengan migrations)
npm run db:migrate
```

## 📞 Support

Jika ada pertanyaan atau issue:

- **GitHub Issues**: [Link to issues]
- **Developer Lead**: [Nama & Kontak]
- **Panitia PEMILU GEA 2025**: [Kontak]

## 📄 License

© 2025 Himpunan Mahasiswa Teknik Geologi ITB

---

**Built with ❤️ for PEMILU GEA 2025**
