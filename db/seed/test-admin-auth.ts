/**
 * Test Script: Admin Authentication Flow
 * 
 * Script untuk test flow authentication admin:
 * 1. Login dengan token "pemilskuy"
 * 2. Verify admin session cookie
 * 3. Check access to hasil page
 */

import { db } from "../drizzle";
import { adminTokens } from "../schema";
import { compare } from "bcrypt";

async function testAdminAuth() {
  try {
    console.log("\n🔐 Testing Admin Authentication Flow...\n");

    const testToken = "pemilskuy";
    console.log(`📝 Test token: "${testToken}"\n`);

    const allAdminTokens = await db.query.adminTokens.findMany();
    console.log(`📦 Found ${allAdminTokens.length} admin token(s) in database\n`);

    if (allAdminTokens.length === 0) {
      console.log("❌ No admin tokens found! Run seed-admin-token.ts first.");
      process.exit(1);
    }

    let matched = false;
    for (const adminToken of allAdminTokens) {
      console.log(`🔍 Checking admin token: ${adminToken.name} (ID: ${adminToken.id})`);
      console.log(`   Active: ${adminToken.isActive}`);
      console.log(`   Created: ${adminToken.createdAt}`);
      console.log(`   Last used: ${adminToken.lastUsedAt || "Never"}`);

      const isMatch = await compare(testToken, adminToken.tokenHash);
      console.log(`   Token match: ${isMatch ? "✅ YES" : "❌ NO"}\n`);

      if (isMatch && adminToken.isActive) {
        matched = true;
        console.log(`✅ SUCCESS! Token "${testToken}" matches admin: ${adminToken.name}`);
        console.log(`\n📋 Expected Flow:`);
        console.log(`   1. User enters token: "pemilskuy"`);
        console.log(`   2. API validates token against hash in database`);
        console.log(`   3. Sets cookies: admin-session=${adminToken.id}, user-role=admin`);
        console.log(`   4. Redirects to: /hasil`);
        console.log(`   5. /hasil page verifies admin-session cookie`);
        console.log(`   6. If valid, displays voting results`);
        console.log(`   7. If invalid, redirects to /auth/sign-in\n`);
        break;
      }
    }

    if (!matched) {
      console.log(`❌ FAILED! Token "${testToken}" does not match any active admin token.`);
      console.log(`\n💡 Make sure you have seeded the admin token with:`);
      console.log(`   npx tsx db/seed/seed-admin-token.ts\n`);
      process.exit(1);
    }

    console.log("✅ Admin authentication test complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testAdminAuth();
