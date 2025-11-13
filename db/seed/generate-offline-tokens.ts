/**
 * db/seed/generate-offline-tokens.ts
 * 
 * Script untuk generate token unik untuk offline voters
 * 
 * Token akan:
 * 1. Di-generate secara cryptographically secure
 * 2. Di-hash dengan SHA-256 sebelum disimpan ke database
 * 3. Token mentah dicetak untuk diberikan ke panitia/pemilih
 * 
 * Jalankan dengan: npx tsx db/seed/generate-offline-tokens.ts <path-to-offline-voters.csv>
 * 
 * Format CSV:
 * email
 * offline1@students.itb.ac.id
 * offline2@students.itb.ac.id
 */

import { db } from "../drizzle";
import { voterRegistry } from "../schema";
import { generateSecureToken, hashToken } from "../../lib/encryption";
import { eq } from "drizzle-orm";
import * as fs from "fs";

interface TokenOutput {
  email: string;
  token: string; // Token mentah (untuk dicetak)
  tokenHash: string; // Hash (untuk referensi)
}

/**
 * Parse CSV file berisi email offline voters
 */
function parseOfflineVotersCSV(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && line !== "email"); // Skip header and empty lines

  return lines.filter((email) => email.includes("@"));
}

/**
 * Generate tokens untuk offline voters
 */
async function generateOfflineTokens() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "❌ Usage: npx tsx db/seed/generate-offline-tokens.ts <path-to-offline-voters.csv>"
    );
    process.exit(1);
  }

  const csvPath = args[0];

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📄 Reading offline voters from: ${csvPath}`);

  try {
    // Parse CSV
    const emails = parseOfflineVotersCSV(csvPath);
    console.log(`✅ Found ${emails.length} offline voters`);

    // Generate tokens
    console.log("\n🔐 Generating tokens...");

    const tokenOutputs: TokenOutput[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const email of emails) {
      try {
        // Cek apakah email ada di voter registry
        const voter = await db.query.voterRegistry.findFirst({
          where: eq(voterRegistry.email, email),
        });

        if (!voter) {
          console.warn(`⚠️  Email not in DPT: ${email} - Skipping`);
          errorCount++;
          continue;
        }

        if (voter.hasVoted) {
          console.warn(`⚠️  Already voted: ${email} - Skipping`);
          errorCount++;
          continue;
        }

        // Generate token
        const token = generateSecureToken(32); // 64 character hex string
        const tokenHash = hashToken(token);

        // Update voter registry
        await db
          .update(voterRegistry)
          .set({
            tokenHash: tokenHash,
            voteMethod: "offline",
          })
          .where(eq(voterRegistry.email, email));

        tokenOutputs.push({
          email,
          token,
          tokenHash,
        });

        successCount++;
        console.log(`✅ Generated token for: ${email}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Failed for ${email}: ${error.message}`);
      }
    }

    // Save tokens to file
    const outputPath = `tokens-output-${Date.now()}.txt`;
    let fileContent = "=== OFFLINE VOTING TOKENS ===\n";
    fileContent += `Generated at: ${new Date().toISOString()}\n`;
    fileContent += `Total: ${tokenOutputs.length}\n\n`;
    fileContent += "IMPORTANT: Simpan file ini dengan aman. Token tidak bisa di-recover.\n\n";
    fileContent += "=".repeat(80) + "\n\n";

    tokenOutputs.forEach((output, index) => {
      fileContent += `[${index + 1}] Email: ${output.email}\n`;
      fileContent += `    Token: ${output.token}\n`;
      fileContent += `    Hash:  ${output.tokenHash.substring(0, 16)}...\n`;
      fileContent += "\n";
    });

    fs.writeFileSync(outputPath, fileContent);

    console.log("\n=== Generation Summary ===");
    console.log(`✅ Successfully generated: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${emails.length}`);
    console.log(`\n📝 Tokens saved to: ${outputPath}`);
    console.log(
      "\n⚠️  PENTING: Simpan file token dengan aman! Token tidak bisa di-recover setelah ini."
    );
  } catch (error) {
    console.error("❌ Error generating tokens:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run generation
generateOfflineTokens();
