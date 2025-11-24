# Setup Supabase Database - PEMILU GEA 2025

## 🚀 Quick Setup

### 1. Create Supabase Project

1. **Go to**: https://supabase.com/dashboard
2. **Click**: "New Project"
3. **Fill in**:
   - Name: `pemilu-gea-2025`
   - Database Password: (Generate strong password, SAVE IT!)
   - Region: Southeast Asia (Singapore) atau yang terdekat
4. **Wait**: ~2 minutes untuk provisioning

---

### 2. Get Database Connection String

1. **Go to**: Project Dashboard → Settings → Database
2. **Scroll to**: "Connection String"
3. **Select**: "Transaction" mode (bukan Pooler)
4. **Copy** connection string:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
5. **Replace** `[YOUR-PASSWORD]` dengan password dari Step 1

---

### 3. Update `.env.local`

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"

# Azure AD
AZURE_AD_CLIENT_ID="<from-azure-portal>"
AZURE_AD_CLIENT_SECRET="<from-azure-portal>"
AZURE_AD_TENANT_ID="common"

# Encryption
VOTE_ENCRYPTION_KEY="<generate-with-crypto-randomBytes-32>"

# Email (Gmail)
EMAIL="geapemilu@gmail.com"
EMAIL_PASSWORD="<16-char-app-password>"
EMAIL_FROM="geapemilu@gmail.com"
```

---

### 4. Install Dependencies

```bash
cd "D:\ITB\PEMILU GEA\PemiluGEA2025"
npm install postgres @supabase/supabase-js
```

---

### 5. Run Migrations

```bash
# Push schema to Supabase
npm run db:push

# Or manually
npx drizzle-kit push
```

**Output yang benar**:

```
✓ Migrations complete!
✓ Tables created: voter_registry, ballot_box, candidates, admins
```

---

### 6. Seed Data

#### Seed Candidates:

```bash
npm run db:seed:candidates
```

#### Import DPT:

```bash
npx tsx db/seed/import-dpt.ts dpt-2025.csv
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'pg'"

**Cause**: Using old Neon driver

**Fix**: ✅ Already fixed! Now using `postgres-js` driver

### Error: "Connection timeout"

**Cause**: Wrong connection string or region

**Fix**:

1. Double-check connection string dari Supabase Dashboard
2. Pastikan format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@...`
3. Pastikan password benar (no special URL encoding needed)

### Error: "SSL required"

**Cause**: Supabase requires SSL

**Fix**: Add `?sslmode=require` di akhir connection string:

```env
DATABASE_URL="postgresql://...postgres?sslmode=require"
```

### Error: "Too many connections"

**Cause**: Connection pooling issue

**Fix**: Use Transaction mode (bukan Session Pooler):

```
postgresql://postgres.[REF]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres
```

---

## 📊 Verify Setup

### 1. Test Connection:

```bash
npx tsx -e "import { db } from './db/drizzle'; db.select().from(db._.schema.voterRegistry).limit(1).then(console.log)"
```

### 2. Check Tables in Supabase:

1. Go to: Supabase Dashboard → Table Editor
2. Should see:
   - `voter_registry`
   - `ballot_box`
   - `candidates`
   - (optional) `admins`

### 3. Run Query:

```sql
-- In Supabase SQL Editor
SELECT * FROM voter_registry LIMIT 10;
SELECT * FROM candidates;
```

---

## 🆚 Neon vs Supabase Comparison

| Feature    | Neon                       | Supabase            |
| ---------- | -------------------------- | ------------------- |
| Driver     | `@neondatabase/serverless` | `postgres-js`       |
| Connection | WebSocket-based            | Direct PostgreSQL   |
| Free Tier  | 0.5GB, 1 project           | 500MB, 2 projects   |
| Region     | Auto (US/EU)               | Choose (AP, US, EU) |
| UI         | SQL Editor                 | Table Editor + SQL  |
| Auth       | No                         | Yes (built-in)      |
| Storage    | No                         | Yes (S3-like)       |

**Why Supabase?**

- ✅ Better free tier limits
- ✅ Built-in Table Editor
- ✅ No `pg` module conflict
- ✅ Better for Indonesia (Singapore region)
- ✅ Additional features (Auth, Storage, Realtime)

---

## 🔐 Production Setup (Vercel)

### Update Environment Variables:

**Vercel Dashboard → Settings → Environment Variables**

```env
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres
```

**Important**:

- Use **Transaction mode** connection string (port 5432)
- NOT Session Pooler (port 6543)
- Add `?sslmode=require` if needed

---

## 📝 Migration from Neon to Supabase

### If you have existing Neon data:

#### Option 1: Export/Import (Recommended)

```bash
# Export from Neon
pg_dump $NEON_DATABASE_URL > backup.sql

# Import to Supabase
psql $SUPABASE_DATABASE_URL < backup.sql
```

#### Option 2: Fresh Start

1. Run migrations on Supabase
2. Re-seed candidates
3. Re-import DPT

---

## ✅ Final Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] `.env.local` updated
- [ ] `postgres` package installed
- [ ] Migrations run (`npm run db:push`)
- [ ] Candidates seeded
- [ ] DPT imported
- [ ] Vercel env vars updated
- [ ] Test connection works
- [ ] Test login works
- [ ] Test voting works

---

## 🆘 Support

**Supabase Docs**: https://supabase.com/docs/guides/database
**Discord**: https://discord.supabase.com
**Status**: https://status.supabase.com

**Project Contact**: geapemilu@gmail.com

---

**May the Force Be With You!** 🌟
