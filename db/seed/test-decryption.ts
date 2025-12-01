import { db } from "../drizzle";
import { ballotBox } from "../schema";
import { decryptBallot, type EncryptedBallot } from "../../lib/encryption";

async function testDecryption() {
  try {
    console.log("\n🔍 Testing ballot decryption...\n");

    const ballots = await db.query.ballotBox.findMany();
    console.log(`📦 Found ${ballots.length} ballots\n`);

    if (ballots.length === 0) {
      console.log("⚠️  No ballots to test");
      process.exit(0);
    }

    for (let i = 0; i < ballots.length; i++) {
      const ballot = ballots[i];
      console.log(`\n📋 Ballot ${i + 1}:`);
      console.log(`   ID: ${ballot.id}`);
      console.log(`   Cast at: ${ballot.castAt}`);

      try {
        const encryptedData = ballot.encryptedBallotData as EncryptedBallot;
        const decrypted = decryptBallot(encryptedData);
        
        console.log(`   ✅ Decryption successful!`);
        console.log(`   Ketua Umum votes:`, decrypted.ketuaUmum);
        console.log(`   Senator votes:`, decrypted.senator);
      } catch (error) {
        console.error(`   ❌ Decryption failed:`, error);
      }
    }

    console.log("\n✅ Test complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testDecryption();
