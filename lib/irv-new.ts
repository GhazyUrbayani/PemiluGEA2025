/**
 * lib/irv.ts
 * 
 * Instant Runoff Voting (IRV) Algorithm untuk PEMILU GEA 2025
 * 
 * PERUBAHAN PENTING dari GEA 2024:
 * - "KOTAK_KOSONG" diperlakukan sebagai kandidat biasa (bukan special case)
 * - Tidak ada preferensi otomatis atau fallback
 * - Eliminasi murni berdasarkan first-preference votes per round
 */

export interface Ballot {
  ketuaUmum: string[]; // Array kandidat ID dalam urutan preferensi
  senator: string[];
}

export interface IRVRound {
  round: number;
  votes: Record<string, number>; // kandidat_id => jumlah suara
  eliminated?: string; // kandidat yang dieliminasi di round ini
  winner?: string; // pemenang (jika ada)
}

export interface IRVResult {
  winner: string;
  rounds: IRVRound[];
  totalBallots: number;
}

/**
 * Konstanta untuk Kotak Kosong
 */
export const KOTAK_KOSONG = "KOTAK_KOSONG";

/**
 * Menjalankan algoritma IRV untuk satu posisi (Ketua Umum atau Senator)
 * 
 * @param ballots - Array preferensi pemilih untuk posisi tertentu
 * @param candidateIds - Array ID kandidat yang berkompetisi (termasuk KOTAK_KOSONG jika ada)
 * @returns Hasil IRV dengan detail per round
 * 
 * @example
 * ```typescript
 * const ballots = [
 *   ["kandidat_A", "KOTAK_KOSONG", "kandidat_B"],
 *   ["kandidat_B", "kandidat_A"],
 *   ["KOTAK_KOSONG", "kandidat_A", "kandidat_B"]
 * ];
 * 
 * const candidateIds = ["kandidat_A", "kandidat_B", "KOTAK_KOSONG"];
 * 
 * const result = runIRV(ballots, candidateIds);
 * console.log(result.winner); // "kandidat_A" atau "kandidat_B" atau "KOTAK_KOSONG"
 * ```
 */
export function runIRV(
  ballots: string[][],
  candidateIds: string[]
): IRVResult {
  // Validasi input
  if (!ballots || ballots.length === 0) {
    throw new Error("Tidak ada ballot untuk dihitung");
  }

  if (!candidateIds || candidateIds.length === 0) {
    throw new Error("Tidak ada kandidat untuk dihitung");
  }

  const rounds: IRVRound[] = [];
  let remainingCandidates = [...candidateIds]; // Kandidat yang masih berkompetisi
  let activeBallots = ballots.map((ballot) => [...ballot]); // Copy ballots
  let roundNumber = 1;

  while (remainingCandidates.length > 1) {
    // Hitung first-preference votes untuk setiap kandidat di round ini
    const votes: Record<string, number> = {};
    
    // Inisialisasi votes untuk semua kandidat yang tersisa
    remainingCandidates.forEach((candidateId) => {
      votes[candidateId] = 0;
    });

    // Hitung suara berdasarkan preferensi pertama di setiap ballot
    activeBallots.forEach((ballot) => {
      // Cari kandidat pertama dalam ballot yang masih berkompetisi
      const firstPreference = ballot.find((candidateId) =>
        remainingCandidates.includes(candidateId)
      );

      if (firstPreference) {
        votes[firstPreference] = (votes[firstPreference] || 0) + 1;
      }
    });

    // Cek apakah ada kandidat yang menang (>50% suara)
    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
    const majorityThreshold = totalVotes / 2;

    let winner: string | undefined = undefined;
    for (const [candidateId, voteCount] of Object.entries(votes)) {
      if (voteCount > majorityThreshold) {
        winner = candidateId;
        break;
      }
    }

    // Record round ini
    const currentRound: IRVRound = {
      round: roundNumber,
      votes,
    };

    if (winner) {
      // Ada pemenang di round ini
      currentRound.winner = winner;
      rounds.push(currentRound);
      
      return {
        winner,
        rounds,
        totalBallots: ballots.length,
      };
    }

    // Tidak ada pemenang, eliminasi kandidat dengan suara terendah
    const candidatesWithVotes = Object.entries(votes)
      .filter(([_, voteCount]) => voteCount >= 0)
      .sort((a, b) => a[1] - b[1]); // Sort ascending by vote count

    if (candidatesWithVotes.length === 0) {
      throw new Error("Tidak ada kandidat dengan suara valid");
    }

    // Kandidat dengan suara terendah
    const lowestVoteCount = candidatesWithVotes[0][1];
    
    // Cek apakah ada tie di posisi terendah
    const candidatesWithLowestVotes = candidatesWithVotes.filter(
      ([_, voteCount]) => voteCount === lowestVoteCount
    );

    // Jika ada tie di posisi terendah, pilih salah satu secara deterministik (alphabetically)
    // Atau bisa implement tie-breaking rule sesuai requirement panitia
    const eliminatedCandidate = candidatesWithLowestVotes.sort((a, b) =>
      a[0].localeCompare(b[0])
    )[0][0];

    currentRound.eliminated = eliminatedCandidate;
    rounds.push(currentRound);

    // Hapus kandidat yang dieliminasi dari remaining candidates
    remainingCandidates = remainingCandidates.filter(
      (id) => id !== eliminatedCandidate
    );

    roundNumber++;

    // Safeguard: Jika sudah 100 round (shouldn't happen), break untuk avoid infinite loop
    if (roundNumber > 100) {
      throw new Error("IRV calculation exceeded maximum rounds");
    }
  }

  // Jika hanya tersisa 1 kandidat, kandidat tersebut adalah pemenang
  if (remainingCandidates.length === 1) {
    const winner = remainingCandidates[0];
    
    // Hitung suara final
    const finalVotes: Record<string, number> = {};
    finalVotes[winner] = activeBallots.length;

    rounds.push({
      round: roundNumber,
      votes: finalVotes,
      winner,
    });

    return {
      winner,
      rounds,
      totalBallots: ballots.length,
    };
  }

  throw new Error("IRV calculation did not produce a winner");
}

/**
 * Dekripsi dan jalankan IRV untuk semua ballot
 * 
 * @param encryptedBallots - Array ballot terenkripsi dari database
 * @param candidateIdsKahim - ID kandidat Ketua Umum (termasuk KOTAK_KOSONG)
 * @param candidateIdsSenator - ID kandidat Senator (termasuk KOTAK_KOSONG)
 * @returns Hasil IRV untuk kedua posisi
 */
export async function calculateElectionResults(
  encryptedBallots: any[],
  candidateIdsKahim: string[],
  candidateIdsSenator: string[]
) {
  // Import decrypt function
  const { decryptBallot } = await import("./encryption");

  // Dekripsi semua ballots
  const decryptedBallots: Ballot[] = [];
  
  for (const encryptedBallot of encryptedBallots) {
    try {
      const decrypted = decryptBallot(encryptedBallot.encryptedBallotData);
      decryptedBallots.push(decrypted);
    } catch (error) {
      console.error("Gagal dekripsi ballot:", error);
      // Skip ballot yang gagal dekripsi
      continue;
    }
  }

  // Extract preferences untuk masing-masing posisi
  const kahimBallots = decryptedBallots.map((b) => b.ketuaUmum);
  const senatorBallots = decryptedBallots.map((b) => b.senator);

  // Jalankan IRV untuk Ketua Umum
  const kahimResult = runIRV(kahimBallots, candidateIdsKahim);

  // Jalankan IRV untuk Senator
  const senatorResult = runIRV(senatorBallots, candidateIdsSenator);

  return {
    ketuaUmum: kahimResult,
    senator: senatorResult,
    totalValidBallots: decryptedBallots.length,
    totalEncryptedBallots: encryptedBallots.length,
  };
}

/**
 * Helper function: Format hasil IRV untuk display
 */
export function formatIRVResults(result: IRVResult): string {
  let output = `=== Hasil IRV ===\n`;
  output += `Total Ballot: ${result.totalBallots}\n`;
  output += `Pemenang: ${result.winner}\n\n`;

  result.rounds.forEach((round) => {
    output += `Round ${round.round}:\n`;
    Object.entries(round.votes)
      .sort((a, b) => b[1] - a[1]) // Sort descending by votes
      .forEach(([candidateId, votes]) => {
        output += `  ${candidateId}: ${votes} suara\n`;
      });

    if (round.eliminated) {
      output += `  → Dieliminasi: ${round.eliminated}\n`;
    }

    if (round.winner) {
      output += `  🏆 Pemenang: ${round.winner}\n`;
    }

    output += `\n`;
  });

  return output;
}
