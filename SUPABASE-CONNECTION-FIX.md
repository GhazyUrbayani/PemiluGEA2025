# 🚨 URGENT: Get Correct Supabase Connection String

## Error yang terjadi:

```
PostgresError: Tenant or user not found
```

**Artinya**: Connection string format salah atau project tidak ditemukan.

---

## ✅ Cara Mendapatkan Connection String yang BENAR:

### Step 1: Login ke Supabase

https://supabase.com/dashboard

### Step 2: Pilih Project

- Click project: `pemilugea2025` (atau nama project Anda)
- Jika belum ada, create new project dulu

### Step 3: Get Connection String

#### Go to: Settings → Database

![image](https://user-images.githubusercontent.com/xxx/xxx.png)

Scroll ke bawah ke section **"Connection String"**

#### PENTING: Ada 3 pilihan connection string:

1. **Session Pooler** (Port 6543) - ❌ JANGAN INI untuk seeding
2. **Transaction Pooler** (Port 6543) - ✅ **GUNAKAN INI**
3. **Direct Connection** (Port 5432) - ✅ Juga bisa

#### Copy Connection String:

**Transaction Pooler** (Recommended):

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**Direct Connection** (Alternative):

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 4: Replace [YOUR-PASSWORD]

⚠️ **CRITICAL**: Ganti `[YOUR-PASSWORD]` dengan password database Anda!

Password ini adalah password yang Anda set saat create project.

**Jika lupa password**:

1. Go to: Settings → Database
2. Click "Reset Database Password"
3. Set new password
4. SAVE password di password manager!

### Step 5: Update `.env.local`

```env
# Transaction Pooler (Recommended for scripts)
DATABASE_URL="postgresql://postgres.skgismuiwszupcpdcpko:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

Atau

```env
# Direct Connection (Alternative)
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.skgismuiwszupcpdcpko.supabase.co:5432/postgres"
```

---

## 🔍 How to Find Your Project Reference ID

**Project Reference ID** adalah kode unik project Anda (contoh: `skgismuiwszupcpdcpko`)

### Where to find:

1. Supabase Dashboard → Project Settings → General
2. Look for: **"Reference ID"**
3. Atau lihat di URL dashboard: `https://supabase.com/dashboard/project/YOUR_REF_ID`

---

## 🧪 Test Connection

Setelah update `.env.local`, test:

```bash
npm run db:push
```

**Expected output**:

```
✓ Pulling schema from database...
✓ Changes applied
```

**If still error**:

1. Double-check password (no typo!)
2. Make sure project is active (not paused)
3. Try Direct Connection instead of Pooler
4. Check Supabase project logs: Dashboard → Logs

---

## 📝 Complete `.env.local` Template

```env
# === SUPABASE DATABASE ===
# Get from: Supabase Dashboard → Settings → Database → Connection String
# Choose: Transaction Pooler or Direct Connection
DATABASE_URL="postgresql://postgres.YOUR_REF:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

# === NEXTAUTH ===
NEXTAUTH_SECRET="P8zKx9mN4qW2vY5jR7tH6fL3gD1aS0bC"
NEXTAUTH_URL="http://localhost:3000"

# === AZURE AD (Optional) ===
AZURE_AD_CLIENT_ID="your-azure-ad-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-ad-client-secret"
AZURE_AD_TENANT_ID="common"

# === ENCRYPTION ===
VOTE_ENCRYPTION_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
VOTE_ENCRYPTION_SALT="pemilu-gea-2025-salt"

# === EMAIL ===
EMAIL="lesbahasaarab.sahal@gmail.com"
EMAIL_PASSWORD="grnc tyrk pcri nudi"
EMAIL_FROM="geapemilu@gmail.com"

# === ENVIRONMENT ===
NODE_ENV="development"
```

---

## 🆘 Still Having Issues?

### Option 1: Create Fresh Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill:
   - Name: `pemilu-gea-2025-new`
   - Password: Set strong password (SAVE IT!)
   - Region: **Southeast Asia (Singapore)**
4. Wait 2 minutes for provisioning
5. Get NEW connection string
6. Update `.env.local`

### Option 2: Check Project Status

1. Dashboard → Project Settings → General
2. Check: **"Status: Active"**
3. If paused, click "Resume"

### Option 3: Contact Support

- Supabase Discord: https://discord.supabase.com
- Or: Email geapemilu@gmail.com

---

## ⚡ Quick Fix Commands

```bash
# 1. Update .env.local with CORRECT connection string
code .env.local

# 2. Test connection
npm run db:push

# 3. If success, seed candidates
npm run db:seed:candidates

# 4. Import DPT
npx tsx db/seed/import-dpt.ts dpt-sample.csv --skip-email
```

---

**Current Issue**: Your connection string format is wrong or password is incorrect.

**Next Step**: Get the CORRECT connection string from Supabase Dashboard → Settings → Database → Connection String → **Transaction Pooler**

---

**May the Force Be With You!** 🌟
