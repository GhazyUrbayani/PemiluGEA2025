import { db } from "../drizzle";
import { voterRegistry } from "../schema";
import { generateSecureToken, hashToken } from "../../lib/encryption";
import { eq, sql } from "drizzle-orm";
import * as fs from "fs";

interface TokenOutput {
  email: string;
  token: string; // Token mentah (untuk dicetak)
  tokenHash: string;
}

function parseOfflineVotersCSV(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && line !== "email"); // Skip header and empty lines

  return lines.filter((email) => email.includes("@"));
}

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
    const emails = parseOfflineVotersCSV(csvPath);
    console.log(`✅ Found ${emails.length} offline voters`);

    console.log("\n🔐 Generating tokens...");

    const tokenOutputs: TokenOutput[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const email of emails) {
      try {
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

        // Generate unique token with collision check
        let token = "";
        let tokenHash = "";
        let isUnique = false;
        let retryCount = 0;
        const MAX_RETRIES = 10;

        while (!isUnique && retryCount < MAX_RETRIES) {
          const tokenLength = 5 + Math.floor(Math.random() * 3); // Random 5-7 digits
          token = Math.floor(Math.random() * Math.pow(10, tokenLength))
            .toString()
            .padStart(tokenLength, "0");
          tokenHash = hashToken(token);

          // Check if this tokenHash already exists in database
          const existingToken = await db.query.voterRegistry.findFirst({
            where: eq(voterRegistry.tokenHash, tokenHash),
          });

          if (!existingToken) {
            isUnique = true;
          } else {
            retryCount++;
            console.log(
              `🔄 Token collision detected for ${email}, retrying... (attempt ${retryCount}/${MAX_RETRIES})`
            );
          }
        }

        if (!isUnique) {
          console.error(
            `❌ Failed to generate unique token for ${email} after ${MAX_RETRIES} attempts`
          );
          errorCount++;
          continue;
        }

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

generateOfflineTokens();
