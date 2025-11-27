/**
 * db/seed/clear-dpt.ts
 * 
 * Script untuk clear semua data DPT dari database
 * HATI-HATI: Ini akan menghapus SEMUA voter registry!
 * 
 * Jalankan: npx tsx db/seed/clear-dpt.ts
 */

import { db } from "../drizzle";
import { voterRegistry } from "../schema";

async function clearDPT() {
  console.log("⚠️  WARNING: This will DELETE ALL voter registry data!");
  console.log("Press Ctrl+C within 3 seconds to cancel...\n");
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("🗑️  Clearing voter registry...");
  
  try {
    await db.delete(voterRegistry);
    console.log("✅ Voter registry cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing voter registry:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

clearDPT();
