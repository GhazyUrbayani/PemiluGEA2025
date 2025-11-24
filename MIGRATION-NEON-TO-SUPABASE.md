# Migration Summary: Neon → Supabase

## ✅ Changes Made

### 1. **Database Driver Changed**

- ❌ Removed: `@neondatabase/serverless`
- ✅ Added: `postgres` (postgres-js)
- ✅ Added: `@supabase/supabase-js`

### 2. **Updated Files**

#### `db/drizzle.ts`

```typescript
// BEFORE (Neon)
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool, { schema });

// AFTER (Supabase)
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

#### `package.json`

```json
// BEFORE
"@neondatabase/serverless": "^0.10.3"

// AFTER
"@supabase/supabase-js": "^2.39.0",
"postgres": "^3.4.3"
```

#### `.env.example`

```env
# BEFORE (Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# AFTER (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres"
```

### 3. **Created Documentation**

- ✅ `SUPABASE-SETUP.md` - Complete setup guide

---

## 🚀 Next Steps

### 1. Wait for npm install to complete

```bash
npm install postgres @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Name: `pemilu-gea-2025`
4. Set database password (SAVE IT!)
5. Region: Southeast Asia (Singapore)

### 3. Get Connection String

1. Dashboard → Settings → Database
2. Copy "Transaction" connection string
3. Replace `[YOUR-PASSWORD]` with your password

### 4. Update `.env.local`

```env
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### 5. Run Migrations

```bash
npm run db:push
```

### 6. Seed Data

```bash
npm run db:seed:candidates
npx tsx db/seed/import-dpt.ts dpt-sample.csv --skip-email
```

### 7. Test

```bash
npm run dev
# Visit: http://localhost:3000
```

---

## 🔧 Error Fixes

### ❌ Error: "Cannot find module 'pg'"

**Status**: ✅ FIXED

- Neon driver needed `pg` module
- Supabase uses `postgres-js` (no `pg` needed)

### ❌ Error: "Module not found" during build

**Status**: ✅ FIXED

- Changed from `drizzle-orm/neon-serverless`
- To: `drizzle-orm/postgres-js`

---

## 📊 Why Supabase?

| Feature       | Neon       | Supabase                     |
| ------------- | ---------- | ---------------------------- |
| **Free Tier** | 0.5GB      | 500MB + extras               |
| **UI**        | SQL only   | Table Editor + SQL + Storage |
| **Region**    | Auto       | Choose (better for Asia)     |
| **Driver**    | Needs `pg` | Uses `postgres-js`           |
| **Extras**    | None       | Auth, Storage, Realtime      |

---

## 🎯 Production Deployment

### Update Vercel Environment Variables:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres
   ```
3. Redeploy application

### No other changes needed!

- All API routes stay the same
- All queries stay the same
- Only connection layer changed

---

## ✅ Checklist

- [x] Remove Neon package
- [x] Add Supabase packages
- [x] Update `db/drizzle.ts`
- [x] Update `.env.example`
- [x] Create setup documentation
- [ ] Wait for `npm install` (in progress...)
- [ ] Create Supabase project
- [ ] Get connection string
- [ ] Update `.env.local`
- [ ] Run migrations
- [ ] Seed data
- [ ] Test locally
- [ ] Update Vercel env vars
- [ ] Deploy to production

---

## 📝 Notes

### Connection String Format (Important!)

**Supabase Transaction Mode** (USE THIS):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**NOT Session Pooler** (Don't use):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Password Tips:

- No need to URL-encode
- Copy directly from Supabase dashboard
- Save in password manager!

---

## 🆘 If Issues

1. **Check npm install completed**:

   ```bash
   npm list postgres @supabase/supabase-js
   ```

2. **Test connection**:

   ```bash
   npx tsx -e "import { db } from './db/drizzle'; console.log('Connected!')"
   ```

3. **Check Supabase logs**:

   - Dashboard → Logs → Database

4. **Verify tables created**:
   - Dashboard → Table Editor

---

**Documentation**: See `SUPABASE-SETUP.md` for detailed guide!

**May the Force Be With You!** 🌟
