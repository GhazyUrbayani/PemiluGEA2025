export type Result = {
    round: number;
    voteCount: Map<string, number>;
    votePercentage: Map<string, number>;
    eliminatedCandidates: string[];
    secondVoteCount: Map<string, number>;
}

export type VotingOutcome = {
    winner: string | null;
    draw?: string[];
    results: Result[];
    totalVotes: number;
}