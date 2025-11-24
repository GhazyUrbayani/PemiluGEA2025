# Import DPT (Daftar Pemilih Tetap) - Automatic Email System

## 📋 Overview

Script untuk import DPT dari CSV file dengan **auto-generate token + auto-send email** ke setiap pemilih.

## 📁 Folder Structure

```
db/seed/
├── import-dpt.ts          # Script import DPT + email automation
├── dpt-template.csv       # Template CSV format
├── dpt-2025.csv          # File CSV Anda (letakkan di sini)
└── tokens-output-*.txt   # Output token (auto-generated)
```

## 🚀 Cara Penggunaan

### Step 0: Setup Email Configuration (PENTING!)

**Untuk auto-send email, wajib setup Gmail App Password terlebih dahulu:**

1. **Buka Google Account Security**: https://myaccount.google.com/apppasswords
2. **Login** dengan akun Gmail yang akan digunakan
3. **Generate App Password**:
   - Select app: **Mail**
   - Select device: **Other (Custom name)** → tulis "PEMILU GEA 2025"
   - Click **Generate**
   - Copy **16-character password** yang muncal (format: `xxxx xxxx xxxx xxxx`)
4. **Update `.env.local`**:
   ```env
   EMAIL="geapemilu@gmail.com"
   EMAIL_PASSWORD="abcd efgh ijkl mnop"  # 16 char dari step 3
   EMAIL_FROM="geapemilu@gmail.com"
   ```

**⚠️ Jika tidak setup email:**

- Gunakan flag `--skip-email` saat import
- Token tetap di-generate dan disimpan ke file
- Kirim token manual ke pemilih

---

### Step 1: Siapkan File CSV

1. Copy `dpt-template.csv` dan rename menjadi `dpt-2025.csv` (atau nama lain)
2. Isi dengan data pemilih dalam format:

```csv
NIM,Email,Nama
12023026,geraldus@students.itb.ac.id,Geraldus Yudhistira Davin
12023075,albert@students.itb.ac.id,Albert Kamaruddin
12024001,mahasiswa@students.itb.ac.id,Nama Mahasiswa
```

**Format Requirements:**

- Header harus: `NIM,Email,Nama` (case-insensitive)
- NIM: Minimal 4 digit (contoh: 12023026)
- Email: Harus valid format email
- Nama: Nama lengkap pemilih

---

### Step 2: Letakkan CSV di Folder `db/seed/`

```
d:\ITB\PEMILU GEA\PemiluGEA2025\db\seed\dpt-2025.csv
```

---

### Step 3: Jalankan Script Import

#### Opsi 1: Auto-send Email (Recommended)

```bash
cd d:\ITB\PEMILU GEA\PemiluGEA2025
npx tsx db/seed/import-dpt.ts dpt-2025.csv
```

Script akan:

1. ✅ Parse CSV
2. ✅ Generate token per pemilih
3. ✅ Insert ke database
4. ✅ **KIRIM EMAIL OTOMATIS** ke setiap pemilih
5. ✅ Save tokens ke file backup

#### Opsi 2: Skip Email (Manual Distribution)

```bash
npx tsx db/seed/import-dpt.ts dpt-2025.csv --skip-email
```

Gunakan jika:

- Email belum dikonfigurasi
- Ingin kirim manual
- Testing/development

---

### Step 4: Hasil Output

Script akan:

1. ✅ Parse CSV file
2. ✅ Generate token unik untuk setiap pemilih (64 karakter hex)
3. ✅ Hash token dengan bcrypt untuk disimpan di database
4. ✅ Insert ke table `voter_registry`:
   - email
   - nim
   - angkatan (extracted from NIM)
   - tokenHash
   - hasVoted: false
   - isEligible: true
   - voteMethod: "offline"
5. ✅ **Kirim email otomatis** ke setiap pemilih (jika tidak --skip-email)
6. ✅ Simpan token mentah ke file `tokens-output-[timestamp].txt`

**Console Output Example:**

```
📄 Reading DPT from: d:\ITB\PEMILU GEA\PemiluGEA2025\db\seed\dpt-2025.csv
📧 Email sending: ENABLED

🔌 Connecting to SMTP server...
✅ SMTP connection verified

✅ Parsed 150 valid rows from CSV

🌱 Importing to database + generating tokens...

✅ Imported: geraldus@students.itb.ac.id (Geraldus Yudhistira Davin)
   📧 Sending email to geraldus@students.itb.ac.id...
✅ Email sent to: geraldus@students.itb.ac.id (Geraldus Yudhistira Davin)

...

============================================================
=== Import Summary ===
✅ Database import successful: 150
❌ Database import failed: 0
📊 Total rows: 150

=== Email Summary ===
✅ Emails sent successfully: 148
❌ Emails failed: 2

⚠️  Failed emails (kirim manual):
   • invalid@email.com: Invalid email address
   • bounced@email.com: Mailbox full

📝 Tokens saved to:
   d:\ITB\PEMILU GEA\PemiluGEA2025\db\seed\tokens-output-2025-11-24T10-30-45.txt

⚠️  PENTING:
   1. Simpan file token dengan AMAN
   2. Email sudah dikirim otomatis (cek email summary)
   3. Untuk email yang gagal, kirim manual dari file token
   4. Token tidak bisa di-recover setelah ini!
============================================================
```

---

### Step 5: Output File Token

File output format:

```
=== PEMILU GEA 2025 - VOTING TOKENS ===
Generated: 24 November 2025, 10:30:45
Total: 150 tokens
Email Status: Sent: 148, Failed: 2

IMPORTANT: Simpan file ini dengan AMAN!
Token sudah dikirim otomatis ke email (cek status di bawah).
Token hanya bisa digunakan 1x untuk voting.

================================================================================

[1] Geraldus Yudhistira Davin
    Email: geraldus@students.itb.ac.id
    Token: a1b2c3d4e5f6...

[2] Albert Kamaruddin
    Email: albert@students.itb.ac.id
    Token: f6e5d4c3b2a1...

...

================================================================================
EMAIL ERRORS (Kirim manual untuk yang gagal):

[1] invalid@email.com
    Error: Invalid email address

[2] bounced@email.com
    Error: Mailbox full
```

---

### Step 6: Email yang Diterima Pemilih

Pemilih akan menerima email dengan format:

**Subject**: 🗳️ Token Voting PEMILU GEA 2025

**Content**:

- Header: PEMILU GEA 2025 (Star Wars themed)
- Greeting: "Halo [Nama]"
- Token box dengan token 64 karakter
- Instruksi lengkap cara menggunakan token
- Button CTA: "Mulai Voting Sekarang"
- Warning: Token hanya bisa digunakan 1x
- Footer: Contact info (email, WhatsApp)

**Email Features**:

- ✅ Responsive HTML design
- ✅ Star Wars theme (purple-cyan gradient)
- ✅ Direct link ke `/auth/sign-in`
- ✅ Plain text fallback
- ✅ Professional layout

---

## ⚠️ Important Notes

1. **Backup Token File**: Simpan `tokens-output-*.txt` dengan AMAN. Token tidak bisa di-recover!
2. **One-Time Use**: Setiap token hanya bisa digunakan 1x untuk voting
3. **Angkatan Auto-Extract**: Angkatan otomatis di-extract dari NIM (contoh: 12023026 → 2023)
4. **Duplicate Prevention**: Email yang sudah ada di database akan skip (error)
5. **CSV Location**: CSV **HARUS** di folder `db/seed/`, tidak bisa di folder lain
6. **Rate Limiting**: Delay 1 detik antar email untuk avoid spam filter
7. **Retry Mechanism**: Auto-retry 3x jika email gagal (exponential backoff: 2s, 4s, 8s)
8. **Email Verification**: SMTP connection di-verify sebelum import dimulai

---

## 🔧 Troubleshooting

### Error: "SMTP Server verification failed"

**Cause**: Email credentials salah atau App Password belum di-generate

**Solution**:

1. Cek `.env.local`:
   ```env
   EMAIL="geapemilu@gmail.com"
   EMAIL_PASSWORD="abcd efgh ijkl mnop"  # 16 char
   ```
2. Generate ulang App Password: https://myaccount.google.com/apppasswords
3. Pastikan menggunakan **App Password**, bukan password Gmail biasa
4. Jika masih error, gunakan `--skip-email`

### Error: "File not found"

- Pastikan CSV ada di: `d:\ITB\PEMILU GEA\PemiluGEA2025\db\seed\dpt-2025.csv`
- Cek nama file (case-sensitive)

### Error: "CSV must have columns: NIM, Email, Nama"

- Pastikan header CSV: `NIM,Email,Nama`
- Tidak ada spasi ekstra di header

### Error: "Invalid email"

- Email harus format valid (ada @)
- Contoh: `mahasiswa@students.itb.ac.id`

### Error: "Invalid NIM"

- NIM minimal 4 digit
- Contoh valid: `12023026`

### Error: "Failed to import: duplicate key"

- Email sudah ada di database
- Hapus row duplicate di CSV atau hapus di database dulu

### Some Emails Failed

**Jika beberapa email gagal dikirim:**

1. Cek console output untuk detail error
2. Lihat section "EMAIL ERRORS" di file token output
3. Kirim manual ke email yang gagal:
   - Copy token dari file output
   - Kirim via email/WhatsApp/Line
4. Common causes:
   - Invalid email address
   - Mailbox full
   - Temporary SMTP error
   - Rate limit exceeded

---

## 📊 Database Schema

Table: `voter_registry`

```sql
CREATE TABLE voter_registry (
  email TEXT PRIMARY KEY,
  nim TEXT,
  angkatan INTEGER,
  token_hash TEXT,
  has_voted BOOLEAN DEFAULT FALSE,
  is_eligible BOOLEAN DEFAULT TRUE,
  vote_method TEXT, -- "offline" | "online" | NULL
  voted_at TIMESTAMP
);
```

---

## 🔐 Security

- Token: 32 bytes random (crypto.randomBytes)
- Hash: bcrypt dengan salt rounds = 10
- Token mentah tidak disimpan di database
- Hanya token hash yang disimpan untuk validasi
- Email: TLS encryption (SMTP port 465)
- App Password: Tidak ada password Gmail yang disimpan plain

---

## 📧 Email Template

Email menggunakan HTML template dengan fitur:

- **Star Wars Theme**: Purple-cyan gradient header
- **Responsive Design**: Mobile-friendly
- **Token Box**: Highlighted dengan border
- **Instructions**: Step-by-step cara voting
- **Warning Box**: Informasi penting (red background)
- **CTA Button**: Direct link ke login page
- **Footer**: Contact info + "May the Force Be With You"

---

## 📝 Next Steps After Import

1. ✅ Import DPT selesai
2. ✅ Email dikirim otomatis ke pemilih
3. 📧 Pemilih cek email dan copy token
4. 🗳️ Pemilih login dengan token di `/auth/sign-in`
5. ✅ Pemilih vote di `/vote`
6. 🔒 Token expire setelah digunakan (hasVoted = true)

---

## 🆘 Support

Jika ada masalah:

1. Cek console output untuk detail error
2. Cek file `tokens-output-*.txt` sudah ter-generate
3. Cek database connection di `.env.local`
4. Cek email configuration di `.env.local`
5. Test SMTP connection: `npx tsx lib/send-token-email.ts` (manual test)
6. Contact: geapemilu@gmail.com | WA: +62 813-1576-3302

---

## 🎯 Quick Reference

| Command                                                   | Description              |
| --------------------------------------------------------- | ------------------------ |
| `npx tsx db/seed/import-dpt.ts dpt-2025.csv`              | Import + auto-send email |
| `npx tsx db/seed/import-dpt.ts dpt-2025.csv --skip-email` | Import only (no email)   |
| `npx tsx db/seed/import-dpt.ts`                           | Show usage help          |

| File                  | Purpose                      |
| --------------------- | ---------------------------- |
| `dpt-template.csv`    | Template CSV kosong          |
| `dpt-2025.csv`        | CSV data pemilih Anda        |
| `tokens-output-*.txt` | Backup tokens + email status |
| `import-dpt.ts`       | Main script                  |

| Environment Variable | Required                 | Description                  |
| -------------------- | ------------------------ | ---------------------------- |
| `EMAIL`              | ✅ (if not --skip-email) | Gmail address                |
| `EMAIL_PASSWORD`     | ✅ (if not --skip-email) | Gmail App Password (16 char) |
| `EMAIL_FROM`         | ❌ (optional)            | Display name for sender      |

---

**May the Force Be With You!** 🌟
