/**
 * Seed Admin Token
 * 
 * Script untuk memasukkan admin token pertama kali ke database.
 * Token diambil dari environment variable ADMIN_TOKEN dan di-hash
 * sebelum disimpan ke Supabase untuk keamanan.
 * 
 * Usage: npx tsx db/seed/seed-admin-token.ts
 */

import { db } from "../drizzle";
import { adminTokens } from "../schema";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function seedAdminToken() {
  console.log("🔐 Starting admin token seeding...\n");

  try {
    // Get admin token from environment variable
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken) {
      console.error("❌ Error: ADMIN_TOKEN tidak ditemukan di environment variable!");
      console.error("   Silakan tambahkan ADMIN_TOKEN ke file .env.local\n");
      process.exit(1);
    }

    console.log("✅ Admin token ditemukan di environment variable");

    // Hash the admin token
    console.log("🔒 Hashing admin token...");
    const tokenHash = await hash(adminToken, 12);
    console.log("✅ Token berhasil di-hash\n");

    // Check if admin token already exists
    const existingToken = await db.query.adminTokens.findFirst();

    if (existingToken) {
      console.log("⚠️  Admin token sudah ada di database!");
      console.log(`   ID: ${existingToken.id}`);
      console.log(`   Name: ${existingToken.name}`);
      console.log(`   Active: ${existingToken.isActive}`);
      console.log(`   Created: ${existingToken.createdAt}\n`);
      
      const confirm = process.argv.includes("--force");
      if (!confirm) {
        console.log("   Jika ingin insert ulang, jalankan dengan flag --force");
        console.log("   Contoh: npx tsx db/seed/seed-admin-token.ts --force\n");
        return;
      }
      
      console.log("🔄 Flag --force detected, melanjutkan insert...\n");
    }

    // Insert admin token to database
    console.log("📝 Inserting admin token ke database...");
    const newToken = await db.insert(adminTokens).values({
      id: uuidv4(),
      tokenHash: tokenHash,
      name: "Admin Panitia PEMILU GEA 2025",
      isActive: true,
    }).returning();

    console.log("✅ Admin token berhasil disimpan ke database!\n");
    console.log("📊 Detail Token:");
    console.log(`   ID: ${newToken[0].id}`);
    console.log(`   Name: ${newToken[0].name}`);
    console.log(`   Active: ${newToken[0].isActive}`);
    console.log(`   Created: ${newToken[0].createdAt}\n`);

    console.log("🎉 Seeding admin token selesai!");
    console.log("💡 Admin sekarang bisa login menggunakan token dari ADMIN_TOKEN\n");

  } catch (error: any) {
    console.error("❌ Error saat seeding admin token:");
    console.error(error.message);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed function
seedAdminToken();
