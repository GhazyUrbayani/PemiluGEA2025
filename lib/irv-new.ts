export interface Ballot {
  ketuaUmum: string[];
  senator: string[];
}

export interface IRVRound {
  round: number;
  votes: Record<string, number>;
  eliminated?: string;
  winner?: string;
}

export interface IRVResult {
  winner: string;
  rounds: IRVRound[];
  totalBallots: number;
}

export const KOTAK_KOSONG = "KOTAK_KOSONG";

export function runIRV(
  ballots: string[][],
  candidateIds: string[]
): IRVResult {
  if (!ballots || ballots.length === 0) {
    throw new Error("Tidak ada ballot untuk dihitung");
  }

  if (!candidateIds || candidateIds.length === 0) {
    throw new Error("Tidak ada kandidat untuk dihitung");
  }

  const rounds: IRVRound[] = [];
  let remainingCandidates = [...candidateIds]; // Kandidat yang masih berkompetisi
  const activeBallots = ballots.map((ballot) => [...ballot]); // Copy ballots
  let roundNumber = 1;

  while (remainingCandidates.length > 1) {
    const votes: Record<string, number> = {};
    
    remainingCandidates.forEach((candidateId) => {
      votes[candidateId] = 0;
    });

    activeBallots.forEach((ballot) => {
      const firstPreference = ballot.find((candidateId) =>
        remainingCandidates.includes(candidateId)
      );

      if (firstPreference) {
        votes[firstPreference] = (votes[firstPreference] || 0) + 1;
      }
    });

    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
    const majorityThreshold = totalVotes / 2;

    let winner: string | undefined = undefined;
    for (const [candidateId, voteCount] of Object.entries(votes)) {
      if (voteCount > majorityThreshold) {
        winner = candidateId;
        break;
      }
    }

    const currentRound: IRVRound = {
      round: roundNumber,
      votes,
    };

    if (winner) {
      currentRound.winner = winner;
      rounds.push(currentRound);
      
      return {
        winner,
        rounds,
        totalBallots: ballots.length,
      };
    }

    const candidatesWithVotes = Object.entries(votes)
      .filter(([, voteCount]) => voteCount >= 0)
      .sort((a, b) => a[1] - b[1]); // Sort ascending by vote count

    if (candidatesWithVotes.length === 0) {
      throw new Error("Tidak ada kandidat dengan suara valid");
    }

    const lowestVoteCount = candidatesWithVotes[0][1];
    
    const candidatesWithLowestVotes = candidatesWithVotes.filter(
      ([, voteCount]) => voteCount === lowestVoteCount
    );

    const eliminatedCandidate = candidatesWithLowestVotes.sort((a, b) =>
      a[0].localeCompare(b[0])
    )[0][0];

    currentRound.eliminated = eliminatedCandidate;
    rounds.push(currentRound);

    remainingCandidates = remainingCandidates.filter(
      (id) => id !== eliminatedCandidate
    );

    roundNumber++;

    if (roundNumber > 100) {
      throw new Error("IRV calculation exceeded maximum rounds");
    }
  }

  if (remainingCandidates.length === 1) {
    const winner = remainingCandidates[0];
    
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
  encryptedBallots: { encryptedBallotData: unknown }[],
  candidateIdsKahim: string[],
  candidateIdsSenator: string[]
) {
  const { decryptBallot } = await import("./encryption");

  const decryptedBallots: Ballot[] = [];
  
  for (const encryptedBallot of encryptedBallots) {
    try {
      const decrypted = decryptBallot(encryptedBallot.encryptedBallotData as { encrypted: string; iv: string; authTag: string });
      decryptedBallots.push(decrypted);
    } catch (error) {
      console.error("Gagal dekripsi ballot:", error);
      continue;
    }
  }

  const kahimBallots = decryptedBallots.map((b) => b.ketuaUmum);
  const senatorBallots = decryptedBallots.map((b) => b.senator);

  const kahimResult = runIRV(kahimBallots, candidateIdsKahim);

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
