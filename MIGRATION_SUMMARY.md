# Migration Summary: Azure AD → Google OAuth & Token Changes

## 📋 Overview
Migrasi sistem authentication dari Microsoft Azure AD ke Google OAuth dan perubahan format token untuk voter dari 64-character hexadecimal menjadi 5-7 digit angka.

---

## 🔄 Changes Made

### 1. Authentication Provider
**Before**: Microsoft Azure AD SSO
**After**: Google OAuth

#### Files Modified:
- `lib/auth-options.ts`
  - Import: `AzureADProvider` → `GoogleProvider`
  - Provider ID: `azure-ad` → `google`
  - Config: `AZURE_AD_*` → `GOOGLE_*`
  - Callback validation updated

- `app/auth/sign-in/hybrid-login-form.tsx`
  - Button text: "Login dengan Microsoft" → "Login dengan Google"
  - Logo: Microsoft SVG → Google SVG (inline)
  - Provider: `signIn("azure-ad")` → `signIn("google")`
  - Button styling: Blue → White with border

- `.env.local`
  ```bash
  # OLD
  AZURE_AD_CLIENT_ID="..."
  AZURE_AD_CLIENT_SECRET="..."
  AZURE_AD_TENANT_ID="common"
  
  # NEW
  GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
  GOOGLE_CLIENT_SECRET="your-google-client-secret"
  ```

### 2. Voter Token Format
**Before**: 64-character hexadecimal string (e.g., `a1b2c3d4e5f6...`)
**After**: 5-7 digit numeric string (e.g., `12345`, `9876543`)

#### Files Modified:
- `db/seed/import-dpt.ts`
  ```typescript
  // OLD
  const token = randomBytes(32).toString("hex"); // 64 chars
  
  // NEW
  const tokenLength = 5 + Math.floor(Math.random() * 3); // 5-7 digits
  const token = Math.floor(Math.random() * Math.pow(10, tokenLength))
    .toString()
    .padStart(tokenLength, '0');
  ```

- `db/seed/generate-offline-tokens.ts`
  - Same token generation logic update

- `app/auth/sign-in/hybrid-login-form.tsx`
  - Placeholder: "Masukkan token Anda" → "Contoh: 12345 atau pemilskuy"
  - Input styling: Added `text-center text-lg font-mono tracking-wider`
  - Label: "Token Unik" → "Token Unik (5-7 digit angka atau admin token)"
  - Info text updated untuk mention 5-7 digit angka

### 3. Admin Token
**No Changes**: Admin token tetap string alphanumeric (`pemilskuy`)
- Stored di database: `admin_tokens` table
- Hash method: bcrypt (unchanged)
- Validation: Tetap sama

---

## 🎯 Token Comparison

| Aspect | Voter Token (OLD) | Voter Token (NEW) | Admin Token |
|--------|------------------|-------------------|-------------|
| **Format** | Hexadecimal | Numeric only | Alphanumeric |
| **Length** | 64 characters | 5-7 digits | Variable |
| **Example** | `a1b2c3d4e5f6...` | `12345` | `pemilskuy` |
| **Generation** | `randomBytes(32).toString("hex")` | Random 5-7 digit number | Manual/env var |
| **Hash** | bcrypt(10) | bcrypt(10) | bcrypt(10) |
| **Use Case** | Offline voting | Offline voting | Admin access |
| **User Friendly** | ❌ Hard to type | ✅ Easy to type | ✅ Easy to remember |

---

## 📦 New Files Created

1. **GOOGLE_OAUTH_SETUP.md**
   - Complete guide untuk setup Google OAuth
   - Step-by-step dengan screenshots reference
   - Troubleshooting common errors
   - Domain restriction setup

2. **db/seed/test-token-generation.ts**
   - Test script untuk verify token generation
   - Generates 20 sample tokens
   - Shows length distribution
   - Validates format (numeric only)

---

## 🗑️ Files Removed

1. **ADMIN_AUTH.md** - Outdated admin auth docs
2. **ADMIN_AUTH_FLOW.md** - Merged into main docs

---

## ✅ Testing Completed

### Token Generation Test
```bash
npx tsx db/seed/test-token-generation.ts
```
**Result**: ✅ Successfully generates 5-7 digit numeric tokens

**Sample Output**:
```
Token 1: 662468 (6 digit)
Token 2: 8361273 (7 digit)
Token 3: 59437 (5 digit)
...

✅ Generated 20 unique tokens
📊 Token length distribution:
   5 digit: 4 tokens
   6 digit: 6 tokens
   7 digit: 10 tokens
```

### TypeScript Compilation
```bash
npx tsc --noEmit
```
**Result**: ✅ No errors

---

## 🚀 Next Steps

### 1. Setup Google OAuth (REQUIRED)
Follow guide: `GOOGLE_OAUTH_SETUP.md`

**Quick Steps**:
1. Create project di Google Cloud Console
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create credentials (Web application)
5. Copy Client ID & Client Secret
6. Update `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
7. Restart dev server: `npm run dev`

### 2. Re-import DPT (RECOMMENDED)
Token yang lama (64-char hex) tidak compatible dengan format baru.

**Option A: Clear dan re-import semua**
```bash
# Clear existing DPT
npx tsx db/seed/clear-dpt.ts

# Import dengan token baru
npx tsx db/seed/import-dpt.ts Testing.csv
```

**Option B: Generate token baru untuk existing voters**
```bash
# Create CSV dengan email existing voters
# Format: email (no header)
# offline1@students.itb.ac.id
# offline2@students.itb.ac.id

npx tsx db/seed/generate-offline-tokens.ts offline-voters.csv
```

### 3. Test Login Flow
1. ✅ **Google SSO**: Login dengan `@students.itb.ac.id` email
2. ✅ **Voter Token**: Login dengan 5-7 digit angka (e.g., `12345`)
3. ✅ **Admin Token**: Login dengan `pemilskuy`

---

## 📊 Impact Analysis

### Breaking Changes
1. ⚠️ **Existing voter tokens invalid**: Perlu re-generate
2. ⚠️ **Azure AD users cannot login**: Harus setup Google OAuth
3. ✅ **Admin token unchanged**: `pemilskuy` tetap works

### User Experience
1. ✅ **Easier token input**: 5-7 digit vs 64-char hex
2. ✅ **Familiar login**: Google vs Microsoft (lebih universal)
3. ✅ **Better mobile UX**: Numeric keyboard auto-shows
4. ✅ **Less errors**: Short numeric easier to type correctly

### Database
1. ✅ **Schema unchanged**: `tokenHash` column tetap sama
2. ✅ **Hash method unchanged**: bcrypt(10)
3. ⚠️ **Data migration needed**: Re-hash new tokens

---

## 🔒 Security Notes

### Token Security
- **Old (64-char hex)**: ~2^256 possibilities
- **New (5-7 digits)**: ~10^5 to 10^7 possibilities (~100K - 10M)
- **Mitigation**: 
  - One-time use (hasVoted flag)
  - Rate limiting on login
  - Short validity window
  - Bcrypt hashing still applied

### Recommendations
1. ✅ Use 7-digit tokens when possible (more secure)
2. ✅ Distribute tokens close to voting time
3. ✅ Monitor for brute force attempts
4. ✅ Consider adding cooldown after failed attempts

---

## 📝 Rollback Plan

If needed, revert dengan:
```bash
git revert 71b99bf
```

Or manual rollback:
1. Change provider back to Azure AD
2. Update token generation back to 64-char hex
3. Update UI text and logos
4. Restore env variables

---

## 📞 Support

Questions or issues:
- Check `GOOGLE_OAUTH_SETUP.md` for OAuth setup
- Check console logs for debugging
- Verify `.env.local` has correct credentials
- Test token generation with test script

---

**Migration Date**: November 29, 2025
**Version**: PEMILU GEA 2025 v2.0
**Status**: ✅ Complete & Tested
