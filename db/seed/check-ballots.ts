/**
 * Script: Check Ballots
 * 
 * Script untuk cek jumlah ballot yang ada di database
 */

import { db } from "../drizzle";
import { ballotBox, voterRegistry, candidates } from "../schema";

async function checkBallots() {
  try {
    console.log("\n🔍 Checking ballot data...\n");

    // Count ballots
    const ballots = await db.query.ballotBox.findMany();
    console.log(`📦 Total ballots in ballot_box: ${ballots.length}`);

    // Count voters
    const voters = await db.query.voterRegistry.findMany();
    const votedVoters = voters.filter(v => v.hasVoted);
    console.log(`👥 Total voters: ${voters.length}`);
    console.log(`✅ Voted: ${votedVoters.length}`);
    console.log(`⏳ Not voted: ${voters.length - votedVoters.length}`);

    // Count candidates
    const allCandidates = await db.query.candidates.findMany();
    const kahimCandidates = allCandidates.filter(c => c.position === "kahim");
    const senatorCandidates = allCandidates.filter(c => c.position === "senator");
    console.log(`\n🎯 Candidates:`);
    console.log(`  Ketua Umum: ${kahimCandidates.length}`);
    console.log(`  Senator: ${senatorCandidates.length}`);

    // Sample ballot data
    if (ballots.length > 0) {
      console.log(`\n📋 Sample ballot (first entry):`);
      console.log(JSON.stringify(ballots[0], null, 2));
    } else {
      console.log(`\n⚠️  No ballots found in database!`);
    }

    console.log("\n✅ Check complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkBallots();
