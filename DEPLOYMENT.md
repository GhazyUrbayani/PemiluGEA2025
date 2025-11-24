# Deployment Guide - PEMILU GEA 2025

## 🚀 Deploy ke Vercel

### Prerequisites

- [x] Repository sudah di GitHub
- [x] Akun Vercel terhubung dengan GitHub
- [x] Database PostgreSQL (Neon) sudah setup

---

## 📋 Step-by-Step Deployment

### 1. Push Code ke GitHub

```bash
cd "D:\ITB\PEMILU GEA\PemiluGEA2025"

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: add token-based auth + email system"

# Push ke remote
git push origin main
```

---

### 2. Setup Vercel Project

1. **Login ke Vercel**: https://vercel.com/dashboard
2. **Import Project**:

   - Click "Add New" → "Project"
   - Select repository: `GhazyUrbayani/PemiluGEA2025`
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

---

### 3. Setup Environment Variables di Vercel

**CRITICAL**: Semua environment variables harus di-set di Vercel!

#### Go to: Project Settings → Environment Variables

**Add berikut ini satu-per-satu:**

#### Database

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

_(Copy dari Neon dashboard)_

#### NextAuth

```env
NEXTAUTH_SECRET=<generate-dengan-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Generate NEXTAUTH_SECRET**:

```bash
# Run di local terminal
openssl rand -base64 32
```

#### Azure AD (Microsoft Login)

```env
AZURE_AD_CLIENT_ID=<dari-azure-portal>
AZURE_AD_CLIENT_SECRET=<dari-azure-portal>
AZURE_AD_TENANT_ID=common
```

**Setup Azure AD Redirect URI**:

1. Buka Azure Portal → App Registrations
2. Select your app
3. Go to "Authentication"
4. Add redirect URI: `https://your-domain.vercel.app/api/auth/callback/azure-ad`
5. Save

#### Encryption

```env
VOTE_ENCRYPTION_KEY=<generate-dengan-crypto>
```

**Generate VOTE_ENCRYPTION_KEY**:

```bash
# Run di local terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Email (Gmail)

```env
EMAIL=geapemilu@gmail.com
EMAIL_PASSWORD=<app-password-16-char>
EMAIL_FROM=geapemilu@gmail.com
```

**Generate Gmail App Password**:

1. https://myaccount.google.com/apppasswords
2. Select: Mail → Other (Custom name) → "PEMILU GEA 2025"
3. Copy 16-character password

---

### 4. Deploy!

Click **"Deploy"** di Vercel Dashboard

Vercel akan:

- ✅ Clone repository
- ✅ Install dependencies
- ✅ Run build command
- ✅ Deploy to production

**Deployment URL**: `https://pemilu-gea-2025.vercel.app` (atau custom domain)

---

### 5. Setup Database di Production

**Run migrations di production database:**

```bash
# Local terminal, pointing to production DB
DATABASE_URL="postgresql://production-url" npm run db:push
```

**Seed candidates:**

```bash
DATABASE_URL="postgresql://production-url" npx tsx db/seed/seed-candidates.ts
```

---

### 6. Import DPT (Voter Registry)

**Option 1: Local Import ke Production DB**

```bash
# Set production DATABASE_URL di .env.local temporarily
DATABASE_URL="postgresql://production-url"

# Import DPT
npx tsx db/seed/import-dpt.ts dpt-2025.csv

# Emails akan dikirim otomatis!
```

**Option 2: Skip Email (Manual Distribution)**

```bash
DATABASE_URL="postgresql://production-url" npx tsx db/seed/import-dpt.ts dpt-2025.csv --skip-email
```

---

### 7. Test Production Deployment

1. **Test Login Microsoft**:

   - Go to: `https://your-domain.vercel.app/auth/sign-in`
   - Click "Login dengan Microsoft"
   - Login with @students.itb.ac.id
   - Should redirect to `/vote`

2. **Test Token Login**:

   - Get token from `tokens-output-*.txt`
   - Go to: `https://your-domain.vercel.app/auth/sign-in`
   - Enter token
   - Click "Gunakan Token"
   - Should redirect to `/vote`

3. **Test Voting**:

   - Select Kahim candidate
   - Select Senator candidate
   - Submit vote
   - Check success page

4. **Test Results (Admin)**:
   - Login as admin
   - Go to: `https://your-domain.vercel.app/hasil`
   - Should see results (if voting closed)

---

## 🔧 Troubleshooting

### Error: "Module not found" during build

- Check `package.json` - all dependencies installed?
- Check `tsconfig.json` - paths configured?
- Check import paths - use `@/` for absolute imports

### Error: "Database connection failed"

- Verify `DATABASE_URL` in Vercel env vars
- Check Neon database is active
- Test connection: `psql $DATABASE_URL`

### Error: "Azure AD authentication failed"

- Verify redirect URI in Azure Portal matches Vercel URL
- Check `AZURE_AD_CLIENT_ID` and `AZURE_AD_CLIENT_SECRET`
- Ensure tenant ID is correct (or use "common")

### Error: "Email sending failed"

- Verify Gmail App Password (not regular password!)
- Check `EMAIL` and `EMAIL_PASSWORD` env vars
- Test SMTP connection locally first

### Build succeeds but app doesn't work

- Check Vercel logs: Project → Deployments → Click deployment → View Logs
- Check Runtime Logs: Project → Logs
- Common issues:
  - Missing env vars
  - Database migrations not run
  - Azure AD redirect URI not configured

---

## 📊 Post-Deployment Checklist

- [ ] Deployment successful (green checkmark in Vercel)
- [ ] All environment variables set in Vercel
- [ ] Azure AD redirect URI updated with production URL
- [ ] Database migrations run on production DB
- [ ] Candidates seeded in production DB
- [ ] DPT imported in production DB
- [ ] Test Microsoft login works
- [ ] Test token login works
- [ ] Test voting flow end-to-end
- [ ] Email notifications working (if enabled)
- [ ] Admin results page accessible
- [ ] Custom domain configured (optional)

---

## 🌐 Custom Domain (Optional)

1. Go to: Vercel Project → Settings → Domains
2. Add domain: `pemilu-gea.com` (or your domain)
3. Configure DNS:
   - Type: `A` → Value: `76.76.21.21`
   - Type: `CNAME` → Name: `www` → Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (~24 hours)
5. Update `NEXTAUTH_URL` in Vercel env vars to new domain
6. Update Azure AD redirect URI to new domain

---

## 🔐 Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `VOTE_ENCRYPTION_KEY` is 32+ characters
- [ ] Gmail App Password used (not regular password)
- [ ] Database password is strong
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] httpOnly cookies enabled for sessions

---

## 📱 Share with Users

**After deployment, share these URLs:**

1. **Voting Link**: `https://your-domain.vercel.app`
2. **Login Page**: `https://your-domain.vercel.app/auth/sign-in`
3. **Candidates**: `https://your-domain.vercel.app/kandidat`
4. **Results**: `https://your-domain.vercel.app/hasil` (admin only)

**User Instructions**:

- Online voters: Login dengan akun Microsoft ITB
- Offline voters: Gunakan token yang dikirim via email

---

## 🆘 Support

**Vercel Dashboard**: https://vercel.com/dashboard
**Documentation**: https://nextjs.org/docs/deployment
**Support**: geapemilu@gmail.com

---

**May the Force Be With You!** 🌟
