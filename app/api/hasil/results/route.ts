/**
 * API Route: /api/hasil/results
 * 
 * Endpoint untuk mendapatkan hasil voting real-time
 * - Menghitung total votes dari ballot_box
 * - Menampilkan jumlah vote untuk setiap kandidat
 * - Hanya bisa diakses oleh admin (check admin session)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { ballotBox, candidates, voterRegistry, adminTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptBallot, type EncryptedBallot } from "@/lib/encryption";

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const adminSessionId = req.cookies.get("admin-session")?.value;
    const userRole = req.cookies.get("user-role")?.value;

    if (!adminSessionId || userRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Verify admin token still exists and active
    const adminToken = await db.query.adminTokens.findFirst({
      where: eq(adminTokens.id, adminSessionId),
    });

    if (!adminToken || !adminToken.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid or inactive admin session" },
        { status: 401 }
      );
    }

    // Fetch all votes from ballot box
    const allBallots = await db.query.ballotBox.findMany();

    // Fetch all candidates
    const allCandidates = await db.query.candidates.findMany();

    // Fetch voter statistics
    const allVoters = await db.query.voterRegistry.findMany();
    const totalVoters = allVoters.length;
    const votedCount = allVoters.filter(v => v.hasVoted).length;
    const onlineVoters = allVoters.filter(v => v.voteMethod === "online" && v.hasVoted).length;
    const offlineVoters = allVoters.filter(v => v.voteMethod === "offline" && v.hasVoted).length;

    // Initialize vote counters
    const kahimVotes: Record<string, number> = {};
    const senatorVotes: Record<string, number> = {};

    // Count votes for each candidate
    for (const ballot of allBallots) {
      try {
        // Decrypt ballot data
        const encryptedData = ballot.encryptedBallotData as EncryptedBallot;
        const decryptedData = decryptBallot(encryptedData);
        
        // Count Ketua Umum votes (first preference only for display)
        if (decryptedData.ketuaUmum && decryptedData.ketuaUmum.length > 0) {
          const firstChoice = decryptedData.ketuaUmum[0];
          kahimVotes[firstChoice] = (kahimVotes[firstChoice] || 0) + 1;
        }

        // Count Senator votes (first preference only for display)
        if (decryptedData.senator && decryptedData.senator.length > 0) {
          const firstChoice = decryptedData.senator[0];
          senatorVotes[firstChoice] = (senatorVotes[firstChoice] || 0) + 1;
        }
      } catch (error) {
        console.error("Error processing ballot:", error);
        // Skip invalid ballots
      }
    }

    // Prepare candidate results with vote counts
    const kahimResults = allCandidates
      .filter(c => c.position === "kahim")
      .map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        photoUrl: candidate.photoUrl,
        major: candidate.major,
        batch: candidate.batch,
        votes: kahimVotes[candidate.id] || 0,
        percentage: totalVoters > 0 
          ? ((kahimVotes[candidate.id] || 0) / votedCount * 100).toFixed(1)
          : "0.0"
      }))
      .sort((a, b) => b.votes - a.votes);

    const senatorResults = allCandidates
      .filter(c => c.position === "senator")
      .map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        photoUrl: candidate.photoUrl,
        major: candidate.major,
        batch: candidate.batch,
        votes: senatorVotes[candidate.id] || 0,
        percentage: totalVoters > 0
          ? ((senatorVotes[candidate.id] || 0) / votedCount * 100).toFixed(1)
          : "0.0"
      }))
      .sort((a, b) => b.votes - a.votes);

    return NextResponse.json({
      success: true,
      data: {
        kahim: kahimResults,
        senator: senatorResults,
        statistics: {
          totalVoters,
          votedCount,
          remainingVoters: totalVoters - votedCount,
          onlineVoters,
          offlineVoters,
          participationRate: totalVoters > 0 
            ? ((votedCount / totalVoters) * 100).toFixed(1)
            : "0.0"
        },
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
