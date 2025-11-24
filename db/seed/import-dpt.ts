/**
 * db/seed/import-dpt.ts
 * 
 * Script untuk import Daftar Pemilih Tetap (DPT) ke database dengan generate token otomatis
 * 
 * CARA PENGGUNAAN:
 * 1. Letakkan file CSV di folder db/seed/ (misalnya: dpt-2025.csv)
 * 2. Format CSV: NIM,Email,Nama
 * 3. Jalankan: npx tsx db/seed/import-dpt.ts dpt-2025.csv
 * 4. Token akan di-generate otomatis dan disimpan ke file tokens-output-[timestamp].txt
 * 5. Token file berisi email + token untuk setiap pemilih
 * 
 * Contoh CSV (lihat dpt-template.csv):
 * NIM,Email,Nama
 * 12023026,geraldus@students.itb.ac.id,Geraldus Yudhistira Davin
 * 12023075,albert@students.itb.ac.id,Albert Kamaruddin
 */

import { db } from "../drizzle";
import { voterRegistry } from "../schema";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import * as fs from "fs";
import * as path from "path";
import {
  createEmailTransporter,
  sendTokenEmail,
  verifyEmailConnection,
} from "../../lib/send-token-email";

interface DPTRow {
  email: string;
  nim: string;
  nama: string;
  angkatan: number;
  token?: string; // Token mentah untuk output
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
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  // Validate required columns: NIM, Email, Nama
  if (!headers.includes("nim") || !headers.includes("email") || !headers.includes("nama")) {
    throw new Error("CSV must have columns: NIM, Email, Nama");
  }

  // Parse rows
  const rows: DPTRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    
    if (values.length < 3) {
      console.warn(`⚠️  Skipping invalid row at line ${i + 1}: insufficient columns`);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    // Validate email
    if (!row.email || !row.email.includes("@")) {
      console.warn(`⚠️  Skipping row at line ${i + 1}: invalid email`);
      continue;
    }

    // Validate NIM
    if (!row.nim || row.nim.length < 4) {
      console.warn(`⚠️  Skipping row at line ${i + 1}: invalid NIM`);
      continue;
    }

    // Extract angkatan from NIM (e.g., "12023026" -> 2023)
    const angkatan = parseInt("20" + row.nim.substring(0, 2));

    rows.push({
      email: row.email,
      nim: row.nim,
      nama: row.nama || "Unknown",
      angkatan: angkatan,
    });
  }

  return rows;
}

/**
 * Import DPT ke database dengan auto-generate token + kirim email
 */
async function importDPT() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Usage: npx tsx db/seed/import-dpt.ts <filename.csv> [--skip-email]");
    console.error("   Example: npx tsx db/seed/import-dpt.ts dpt-2025.csv");
    console.error("   Example (skip email): npx tsx db/seed/import-dpt.ts dpt-2025.csv --skip-email");
    console.error("   CSV harus berada di folder db/seed/");
    process.exit(1);
  }

  const csvFilename = args[0];
  const skipEmail = args.includes("--skip-email");
  const csvPath = path.join(__dirname, csvFilename);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    console.error(`   Pastikan file CSV ada di folder: db/seed/`);
    console.error(`   Contoh: db/seed/dpt-2025.csv`);
    process.exit(1);
  }

  console.log(`📄 Reading DPT from: ${csvPath}`);
  console.log(`📧 Email sending: ${skipEmail ? "DISABLED" : "ENABLED"}\n`);

  // Setup email transporter jika tidak skip
  let transporter = null;
  if (!skipEmail) {
    console.log("🔌 Connecting to SMTP server...");
    transporter = createEmailTransporter();
    const isConnected = await verifyEmailConnection(transporter);
    
    if (!isConnected) {
      console.error("❌ SMTP connection failed. Use --skip-email to skip email sending.");
      process.exit(1);
    }
    console.log("✅ SMTP connection verified\n");
  }

  try {
    // Parse CSV
    const dptRows = parseCSV(csvPath);
    console.log(`✅ Parsed ${dptRows.length} valid rows from CSV\n`);

    // Import to database with token generation
    console.log("🌱 Importing to database + generating tokens...\n");

    let successCount = 0;
    let errorCount = 0;
    let emailSuccessCount = 0;
    let emailErrorCount = 0;
    const tokenOutputs: Array<{ email: string; nama: string; token: string }> = [];
    const emailErrors: Array<{ email: string; error: string }> = [];

    for (const row of dptRows) {
      try {
        // Generate token (32 bytes = 64 character hex string)
        const token = randomBytes(32).toString("hex");
        const tokenHash = await hash(token, 10);

        // Insert to database
        await db.insert(voterRegistry).values({
          email: row.email,
          nim: row.nim,
          angkatan: row.angkatan,
          hasVoted: false,
          isEligible: true,
          voteMethod: "offline",
          tokenHash: tokenHash,
        });

        // Save token for output
        tokenOutputs.push({
          email: row.email,
          nama: row.nama,
          token: token,
        });

        successCount++;
        console.log(`✅ Imported: ${row.email} (${row.nama})`);

        // Send email jika tidak skip
        if (!skipEmail && transporter) {
          console.log(`   📧 Sending email to ${row.email}...`);
          const emailResult = await sendTokenEmail(
            transporter,
            row.email,
            row.nama,
            token
          );

          if (emailResult.success) {
            emailSuccessCount++;
          } else {
            emailErrorCount++;
            emailErrors.push({
              email: row.email,
              error: emailResult.error || "Unknown error",
            });
          }

          // Delay antar email (rate limiting)
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second
        }
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`❌ Failed to import ${row.email}: ${errorMessage}`);
      }
    }

    // Save tokens to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(__dirname, `tokens-output-${timestamp}.txt`);
    
    let fileContent = "=== PEMILU GEA 2025 - VOTING TOKENS ===\n";
    fileContent += `Generated: ${new Date().toLocaleString("id-ID")}\n`;
    fileContent += `Total: ${tokenOutputs.length} tokens\n`;
    fileContent += `Email Status: ${skipEmail ? "SKIPPED" : `Sent: ${emailSuccessCount}, Failed: ${emailErrorCount}`}\n\n`;
    fileContent += "IMPORTANT: Simpan file ini dengan AMAN!\n";
    fileContent += skipEmail 
      ? "Token ini perlu dikirim MANUAL ke email masing-masing pemilih.\n"
      : "Token sudah dikirim otomatis ke email (cek status di bawah).\n";
    fileContent += "Token hanya bisa digunakan 1x untuk voting.\n\n";
    fileContent += "=".repeat(80) + "\n\n";

    tokenOutputs.forEach((output, index) => {
      fileContent += `[${index + 1}] ${output.nama}\n`;
      fileContent += `    Email: ${output.email}\n`;
      fileContent += `    Token: ${output.token}\n`;
      fileContent += "\n";
    });

    // Email errors section
    if (!skipEmail && emailErrors.length > 0) {
      fileContent += "\n" + "=".repeat(80) + "\n";
      fileContent += "EMAIL ERRORS (Kirim manual untuk yang gagal):\n\n";
      emailErrors.forEach((err, index) => {
        fileContent += `[${index + 1}] ${err.email}\n`;
        fileContent += `    Error: ${err.error}\n\n`;
      });
    }

    fs.writeFileSync(outputPath, fileContent);

    console.log("\n" + "=".repeat(60));
    console.log("=== Import Summary ===");
    console.log(`✅ Database import successful: ${successCount}`);
    console.log(`❌ Database import failed: ${errorCount}`);
    console.log(`📊 Total rows: ${dptRows.length}`);
    
    if (!skipEmail) {
      console.log("\n=== Email Summary ===");
      console.log(`✅ Emails sent successfully: ${emailSuccessCount}`);
      console.log(`❌ Emails failed: ${emailErrorCount}`);
      if (emailErrors.length > 0) {
        console.log("\n⚠️  Failed emails (kirim manual):");
        emailErrors.forEach((err) => {
          console.log(`   • ${err.email}: ${err.error}`);
        });
      }
    }

    console.log("\n📝 Tokens saved to:");
    console.log(`   ${outputPath}`);
    console.log("\n⚠️  PENTING:");
    console.log("   1. Simpan file token dengan AMAN");
    if (skipEmail) {
      console.log("   2. Kirim token ke email masing-masing pemilih SECARA MANUAL");
    } else {
      console.log("   2. Email sudah dikirim otomatis (cek email summary)");
      console.log("   3. Untuk email yang gagal, kirim manual dari file token");
    }
    console.log("   " + (skipEmail ? "3" : "4") + ". Token tidak bisa di-recover setelah ini!");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Error importing DPT:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run import
importDPT();
