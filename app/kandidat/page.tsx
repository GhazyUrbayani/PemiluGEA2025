"use client";

import { useState, useEffect } from "react";
import CandidateCard from "@/components/CandidateCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  major: string;
  batch: number;
  vision: string;
  mission: string;
  hashtag?: string;
  position: "kahim" | "senator";
}

export default function KandidatPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      const data = await response.json();
      
      if (data.candidates && Array.isArray(data.candidates)) {
        setCandidates(data.candidates);
        setIsLoading(false);
        return;
      }
      

      const dummyData: Candidate[] = [
        {
          id: "12023026",
          name: "Geraldus Yudhistira Davin",
          photoUrl: "/Davin.png",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Mewujudkan GEA yang inklusif, inovatif, dan berdampak bagi mahasiswa Teknik Geologi ITB",
          mission: "1. Meningkatkan partisipasi aktif anggota dalam kegiatan himpunan<br>2. Memperkuat sinergi dengan alumni dan industri\n3. Mengembangkan program pengembangan soft skill dan hard skill",
          hashtag: "#GerakBersama",
          position: "kahim",
        },
        {
          id: "12023075",
          name: "Albert Kamaruddin",
          photoUrl: "/Albert.png",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Menjadi jembatan aspirasi mahasiswa Teknik Geologi di tingkat institut",
          mission: "1. Menyampaikan aspirasi mahasiswa ke KM ITB\n2. Memperjuangkan kebijakan yang pro-mahasiswa\n3. Transparansi penuh dalam setiap keputusan",
          hashtag: "#SuaraKita",
          position: "senator",
        },
      ];

      setCandidates(dummyData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setIsLoading(false);
    }
  };

  const kahimCandidates = candidates.filter((c) => c.position === "kahim");
  const senatorCandidates = candidates.filter((c) => c.position === "senator");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-space-dark to-vader-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto h-12 w-64" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-space-dark to-vader-black py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="font-death-star text-5xl text-lightsaber-yellow">
            KANDIDAT
          </h1>
          <p className="mt-2 text-sand-gold">
            Pemilihan Umum GEA 2025
          </p>
        </div>

        {/* Side by Side Layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Ketua Umum BPH */}
          <section>
            <h2 className="mb-8 font-death-star text-3xl text-r2d2-blue">
              Calon Ketua Umum BPH
            </h2>
            <div className="flex flex-col gap-8">
              {kahimCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} {...candidate} />
              ))}
            </div>
          </section>

          {/* Senator */}
          <section>
            <h2 className="mb-8 font-death-star text-3xl text-yoda-green">
              Calon Senator
            </h2>
            <div className="flex flex-col gap-8">
              {senatorCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} {...candidate} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
