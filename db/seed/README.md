# Database Seed Tools - PEMILU GEA 2025

## 🎯 Main Tools

### **1. `import-dpt.ts` - Import Voter Registry + Generate Tokens**

**Main tool untuk import DPT dan generate token sekaligus.**

✅ **Features:**
- Import data pemilih dari CSV ke database
- Generate token unik (5-7 digit) untuk setiap pemilih
- **Token collision detection** (max 10 retries)
- Kirim token otomatis via email
- Progress bar dengan ETA
- Export hasil ke file `tokens-output-[timestamp].txt`

📋 **CSV Format Required:**
```csv
NIM,Email,Nama
12024001,12024001@mahasiswa.itb.ac.id,Dzaki Farchri
12024002,12024002@mahasiswa.itb.ac.id,Jonathan Ferdian
```

**Columns wajib:** `NIM`, `Email`, `Nama`

🚀 **Usage:**

```bash
# Import DPT + kirim email otomatis
npx tsx db/seed/import-dpt.ts DataNIM-GeaDPT.csv

# Import DPT tanpa kirim email (manual send)
npx tsx db/seed/import-dpt.ts DataNIM-GeaDPT.csv --skip-email
```

📊 **Output:**
- Database: Data tersimpan di tabel `voterRegistry`
- File: `tokens-output-[timestamp].txt` dengan semua token
- Console: Progress bar + summary

⚡ **Token Uniqueness Guarantee:**
```
1. Generate random 5-7 digit token
2. Hash with bcrypt (10 rounds)
3. Check if tokenHash exists in database
4. If collision → retry (max 10x)
5. If unique → save to database
```

---

### **2. `seed-candidates.ts` - Seed Kandidat**

Populate database dengan data kandidat Ketua Umum dan Senator.

```bash
npx tsx db/seed/seed-candidates.ts
```

---

### **3. `seed-admin-token.ts` - Generate Admin Token**

Generate token untuk akses admin panel.

```bash
npx tsx db/seed/seed-admin-token.ts
```

---

### **4. `clear-dpt.ts` - Clear DPT**

⚠️ **DANGER:** Hapus semua data di `voterRegistry` dan `ballotBox`.

```bash
npx tsx db/seed/clear-dpt.ts
```

---

### **5. `check-ballots.ts` - Check Ballot Data**

Lihat isi encrypted ballot untuk debugging.

```bash
npx tsx db/seed/check-ballots.ts
```

---

## 📁 Data Files

### CSV Files (Input)
- `DataNIM-GeaDPT.csv` - Main DPT data
- `plus21Cadangan.csv` - Cadangan voters (shared email)
- `Testing.csv` - Test data

### Output Files
- `tokens-output-2025-12-01.txt` - Generated tokens with voter info

---

## 🔐 Token System

### Token Generation Rules:
- **Length:** Random 5-7 digits (e.g., `14122`, `658934`)
- **Hashing:** bcrypt with 10 salt rounds
- **Storage:** Only `tokenHash` stored in database
- **Uniqueness:** Guaranteed via collision detection
- **One-time use:** Token marked as used after voting

### Token Collision Detection:
```typescript
// Auto-retry if collision detected
while (!isUnique && retryCount < MAX_RETRIES) {
  token = generateRandomToken();
  tokenHash = await hash(token, 10);
  
  existingToken = await findTokenInDB(tokenHash);
  
  if (!existingToken) {
    isUnique = true; // ✅ Unique token
  } else {
    retryCount++; // 🔄 Retry
  }
}
```

---

## 📧 Email Configuration

Required environment variables in `.env.local`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="PEMILU GEA 2025 <noreply@pemilugea.com>"
```

---

## 🎯 Common Workflows

### **Scenario 1: First Time Setup**
```bash
# 1. Clear database (if needed)
npx tsx db/seed/clear-dpt.ts

# 2. Seed candidates
npx tsx db/seed/seed-candidates.ts

# 3. Import DPT + send emails
npx tsx db/seed/import-dpt.ts DataNIM-GeaDPT.csv

# 4. Generate admin token
npx tsx db/seed/seed-admin-token.ts
```

### **Scenario 2: Add Cadangan Voters**
```bash
# Import additional voters (emails auto-sent)
npx tsx db/seed/import-dpt.ts plus21Cadangan.csv
```

### **Scenario 3: Re-generate Tokens (Manual Send)**
```bash
# Generate tokens without sending emails
npx tsx db/seed/import-dpt.ts Testing.csv --skip-email

# Manually send tokens from output file
```

---

## ⚠️ Important Notes

1. **File yang DIPAKAI:** `import-dpt.ts`
   - ✅ Full featured (import + token + email)
   - ✅ Token collision detection
   - ✅ Progress bar
   
2. **File yang DIHAPUS:**
   - ❌ `generate-offline-tokens.ts` (redundant)
   - ❌ `test-*.ts` files (tidak diperlukan)

3. **Token Security:**
   - Token plaintext HANYA tersimpan di file output
   - Database HANYA menyimpan bcrypt hash
   - File output harus disimpan dengan AMAN
   - Token tidak bisa di-recover setelah file hilang

4. **Email Limits:**
   - Delay 1 detik antar email (avoid SMTP rate limit)
   - Gunakan Gmail App Password (bukan password biasa)
   - Check spam folder jika email tidak masuk

---

## 🐛 Troubleshooting

### "SMTP connection failed"
```bash
# Cek environment variables
cat .env.local | grep EMAIL

# Test with --skip-email flag
npx tsx db/seed/import-dpt.ts Testing.csv --skip-email
```

### "Failed to generate unique token after 10 attempts"
- Sangat rare (probabilitas < 0.001%)
- Kemungkinan: Database sudah ada banyak token
- Solusi: User akan di-skip, re-run import untuk user tersebut

### "CSV parsing error"
- Pastikan header: `NIM,Email,Nama`
- Check encoding: UTF-8
- Check delimiter: comma (`,`)

---

## 📊 Statistics

**Current DPT (2025-12-01):**
- Total voters: 309
- Regular tokens: 299
- Cadangan tokens: 10 (shared email: `12023013@mahasiswa.itb.ac.id`)
- Token length range: 5-7 digits
- Collision probability: ~0.15% (for 309 voters)

---

## 🔗 Related Files

**Database Schema:**
- `db/schema.ts` - Table definitions

**Authentication:**
- `app/api/auth/login-token/route.ts` - Token login
- `lib/encryption.ts` - Token hashing utilities

**Email:**
- `lib/send-token-email.ts` - Email sending logic

