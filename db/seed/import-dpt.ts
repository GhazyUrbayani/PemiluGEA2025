/**
 * db/seed/import-dpt.ts
 * 
 * Script untuk import Daftar Pemilih Tetap (DPT) ke database
 * 
 * Format CSV yang diharapkan:
 * email,nim,angkatan
 * mahasiswa1@students.itb.ac.id,12345001,2022
 * mahasiswa2@students.itb.ac.id,12345002,2023
 * 
 * Jalankan dengan: npx tsx db/seed/import-dpt.ts <path-to-dpt.csv>
 */

import { db } from "../drizzle";
import { voterRegistry } from "../schema";
import * as fs from "fs";
import * as path from "path";

interface DPTRow {
  email: string;
  nim?: string;
  angkatan?: number;
}

/**
 * Parse CSV file menjadi array of objects
 */
function parseCSV(filePath: string): DPTRow[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim());

  // Validate required columns
  if (!headers.includes("email")) {
    throw new Error("CSV must have 'email' column");
  }

  // Parse rows
  const rows: DPTRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });

    // Validate email
    if (!row.email || !row.email.includes("@")) {
      console.warn(`⚠️  Skipping invalid row at line ${i + 1}: missing or invalid email`);
      continue;
    }

    rows.push({
      email: row.email,
      nim: row.nim || null,
      angkatan: row.angkatan ? parseInt(row.angkatan) : null,
    });
  }

  return rows;
}

/**
 * Import DPT ke database
 */
async function importDPT() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Usage: npx tsx db/seed/import-dpt.ts <path-to-dpt.csv>");
    process.exit(1);
  }

  const csvPath = args[0];

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📄 Reading DPT from: ${csvPath}`);

  try {
    // Parse CSV
    const dptRows = parseCSV(csvPath);
    console.log(`✅ Parsed ${dptRows.length} valid rows from CSV`);

    // Import to database
    console.log("\n🌱 Importing to database...");

    let successCount = 0;
    let errorCount = 0;

    for (const row of dptRows) {
      try {
        await db.insert(voterRegistry).values({
          email: row.email,
          nim: row.nim,
          angkatan: row.angkatan,
          hasVoted: false,
          isEligible: true,
          voteMethod: null,
          tokenHash: null,
        });

        successCount++;
        console.log(`✅ Imported: ${row.email}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Failed to import ${row.email}: ${error.message}`);
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`✅ Successfully imported: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${dptRows.length}`);
  } catch (error) {
    console.error("❌ Error importing DPT:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run import
importDPT();
