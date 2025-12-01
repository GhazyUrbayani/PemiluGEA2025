import postgres from "postgres";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });

async function applyMigration() {
  console.log("🔄 Starting migration process...\n");

  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

  try {
    const migrationFile = path.join(__dirname, "0001_drop_admins_create_admin_tokens.sql");
    console.log(`📄 Reading migration file: ${migrationFile}\n`);
    
    const migrationSQL = fs.readFileSync(migrationFile, "utf-8");
    
    console.log("📝 Migration SQL:");
    console.log("─────────────────────────────────────────");
    console.log(migrationSQL);
    console.log("─────────────────────────────────────────\n");

    console.log("🚀 Executing migration...");
    const statements = migrationSQL.split(";").filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    
    console.log("✅ Migration executed successfully!\n");

    console.log("🔍 Verifying new admin_tokens table...");
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admin_tokens'
    `;

    if (result.length > 0) {
      console.log("✅ Table 'admin_tokens' created successfully!");
    } else {
      console.log("⚠️  Table 'admin_tokens' not found. Please check the migration.");
    }

    console.log("\n🔍 Verifying admins table is dropped...");
    const oldTableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admins'
    `;

    if (oldTableCheck.length === 0) {
      console.log("✅ Table 'admins' dropped successfully!");
    } else {
      console.log("⚠️  Table 'admins' still exists. Migration may have failed.");
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("💡 Next step: Run 'npx tsx db/seed/seed-admin-token.ts' to insert admin token\n");

  } catch (error) {
    console.error("\n❌ Error during migration:");
    console.error(error);
    console.error("\n💡 Tip: Make sure your DATABASE_URL is correct in .env.local");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
