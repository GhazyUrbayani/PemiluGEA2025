# Admin Authentication Flow - PEMILU GEA 2025

## 🔐 Overview
Sistem authentication untuk admin menggunakan token-based authentication dengan bcrypt hashing. Admin token "pemilskuy" digunakan untuk akses ke halaman hasil voting.

## 📋 Authentication Flow

### 1. Login Process
```
User → /auth/sign-in
  ↓
Enters token: "pemilskuy"
  ↓
Submit form → POST /api/auth/login-token
  ↓
API validates token:
  - Compare bcrypt hash with database
  - Check if token is active
  ↓
If valid:
  - Set cookie: admin-session = <token-id>
  - Set cookie: user-role = "admin"
  - Return success response with role="admin"
  ↓
Frontend redirects to: /hasil
```

### 2. Hasil Page Access Control
```
User visits /hasil
  ↓
useEffect runs checkAdminAuth()
  ↓
GET /api/auth/check-admin
  ↓
API checks cookies:
  - Read admin-session cookie
  - Read user-role cookie
  ↓
If cookies exist:
  - Verify admin token in database
  - Check if still active
  ↓
If valid:
  - Return isAdmin: true
  - Page fetches voting results
  - Display charts and statistics
  ↓
If invalid:
  - Return isAdmin: false
  - Redirect to /auth/sign-in
```

## 🔑 Admin Token Details

### Database Schema
```typescript
adminTokens {
  id: uuid (primary key)
  tokenHash: text (bcrypt hash)
  name: text
  isActive: boolean
  createdAt: timestamp
  lastUsedAt: timestamp
}
```

### Environment Variable
```bash
# .env.local
ADMIN_TOKEN="pemilskuy"
```

### Current Admin Token
- **Token**: `pemilskuy`
- **Name**: Admin Panitia PEMILU GEA 2025
- **ID**: `beeea21c-e422-4c88-a606-a6fa3a4e0773`
- **Status**: Active
- **Created**: Nov 28, 2025

## 🛡️ Security Features

1. **Password Hashing**: Token stored as bcrypt hash (never plaintext)
2. **HttpOnly Cookies**: Prevents XSS attacks
3. **Secure Cookie**: HTTPS only in production
4. **SameSite: Lax**: CSRF protection
5. **Session Timeout**: 8 hours for admin sessions
6. **Database Verification**: Every request verifies token still active

## 🚀 Usage

### Admin Login
1. Go to http://localhost:3000/auth/sign-in
2. Scroll down to "Login dengan Token"
3. Enter: `pemilskuy`
4. Click "Login dengan Token"
5. Auto-redirects to `/hasil`

### Direct Access Protection
- If user tries to visit `/hasil` without logging in
- System checks admin-session cookie
- If not found or invalid → redirect to `/auth/sign-in`
- If valid → fetch and display voting results

## 🔧 API Endpoints

### POST /api/auth/login-token
**Purpose**: Validate admin token and create session

**Request**:
```json
{
  "token": "pemilskuy"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Login admin berhasil",
  "role": "admin",
  "name": "Admin Panitia PEMILU GEA 2025"
}
```

**Cookies Set**:
- `admin-session`: Token ID (uuid)
- `user-role`: "admin"

### GET /api/auth/check-admin
**Purpose**: Verify admin session

**Request**: No body (cookies in header)

**Response (Success)**:
```json
{
  "isAdmin": true,
  "name": "Admin Panitia PEMILU GEA 2025"
}
```

**Response (Unauthorized)**:
```json
{
  "isAdmin": false,
  "message": "Tidak ada session admin"
}
```

## 📊 Testing

### Test Admin Authentication
```bash
npx tsx db/seed/test-admin-auth.ts
```

### Test Results Access
```bash
npx tsx db/seed/test-decryption.ts
```

### Check Current Ballots
```bash
npx tsx db/seed/check-ballots.ts
```

## 🔄 Maintenance

### Regenerate Admin Token
```bash
# Update .env.local with new token
ADMIN_TOKEN="new-secure-token"

# Run seed script
npx tsx db/seed/seed-admin-token.ts
```

### Deactivate Admin Token
```typescript
// In database or via script
UPDATE admin_tokens 
SET is_active = false 
WHERE id = '<token-id>';
```

## 🐛 Troubleshooting

### Issue: "Anda harus login sebagai admin"
- **Cause**: No admin-session cookie or invalid
- **Solution**: Login again with "pemilskuy" token

### Issue: Page keeps redirecting to /auth/sign-in
- **Cause**: Token expired or deactivated
- **Solution**: Re-seed admin token and login again

### Issue: Cannot see voting results
- **Cause**: API not decrypting ballots or no data
- **Solution**: Check encryption key in .env.local, verify ballots exist

## 📝 Notes

- Admin token is permanent (no expiration in database)
- Cookie session expires after 8 hours
- Multiple admin logins are allowed (cookie per browser)
- Token can be changed anytime via environment variable and re-seeding
- All admin actions are logged (lastUsedAt timestamp)

---

**Last Updated**: November 29, 2025
**System**: PEMILU GEA 2025 - Token-based Admin Authentication
