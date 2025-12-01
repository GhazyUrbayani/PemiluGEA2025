/**
 * Script: Apply Kotak Kosong Migration to Production
 * 
 * This script adds Kotak Kosong candidates to the production database
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });

async function applyMigration() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("❌ DATABASE_URL not found in environment variables");
    process.exit(1);
  }

  console.log("🔗 Connecting to production database...");
  
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log("📄 Reading migration file...");
    const migrationPath = path.join(__dirname, "..", "migrations", "add_kotak_kosong.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("🚀 Applying migration...");
    await client.unsafe(migrationSQL);
    
    console.log("✅ Migration applied successfully!");
    console.log("\n📊 Verifying Kotak Kosong candidates...");
    
    const kotakKosongKahim = await db.query.candidates.findFirst({
      where: (candidates, { eq }) => eq(candidates.id, "KOTAK_KOSONG_KAHIM")
    });
    
    const kotakKosongSenator = await db.query.candidates.findFirst({
      where: (candidates, { eq }) => eq(candidates.id, "KOTAK_KOSONG_SENATOR")
    });
    
    if (kotakKosongKahim) {
      console.log("✅ Kotak Kosong for Kahim exists");
    } else {
      console.log("❌ Kotak Kosong for Kahim NOT FOUND");
    }
    
    if (kotakKosongSenator) {
      console.log("✅ Kotak Kosong for Senator exists");
    } else {
      console.log("❌ Kotak Kosong for Senator NOT FOUND");
    }
    
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    throw error;
  } finally {
    await client.end();
    console.log("\n🔒 Database connection closed");
  }
}

applyMigration()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Fatal error:", err);
    process.exit(1);
  });
