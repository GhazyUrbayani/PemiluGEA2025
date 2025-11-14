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
      
      // Fallback ke DUMMY DATA jika API gagal
      const dummyData: Candidate[] = [
        {
          id: "kahim_1",
          name: "Budi Santoso",
          photoUrl: "/candidates/kahim/candidate1.jpg",
          major: "Teknik Geologi",
          batch: 2022,
          vision: "Membangun GEA yang lebih inklusif dan inovatif untuk seluruh anggota himpunan",
          mission: "Meningkatkan program kerja yang berfokus pada pengembangan soft skill dan networking mahasiswa Geologi",
          hashtag: "#GeaMajuBersama",
          position: "kahim",
        },
        {
          id: "kahim_2",
          name: "Siti Rahma",
          photoUrl: "/candidates/kahim/candidate2.jpg",
          major: "Teknik Geologi",
          batch: 2022,
          vision: "Mewujudkan GEA sebagai wadah aspirasi dan pengembangan mahasiswa Geologi ITB",
          mission: "Membuat sistem yang transparan dan akuntabel dalam setiap kegiatan himpunan",
          hashtag: "#TransparanBerkembang",
          position: "kahim",
        },
        {
          id: "kahim_3",
          name: "Ahmad Fauzi",
          photoUrl: "/candidates/kahim/candidate3.jpg",
          major: "Teknik Geologi",
          batch: 2022,
          vision: "GEA yang solid, produktif, dan berprestasi di tingkat nasional",
          mission: "Memaksimalkan potensi setiap divisi dan mengadakan event berkualitas tinggi",
          hashtag: "#SolidBerprestasi",
          position: "kahim",
        },
        {
          id: "senator_1",
          name: "Dina Permata",
          photoUrl: "/candidates/senator/candidate1.jpg",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Menjadi jembatan aspirasi mahasiswa Geologi di tingkat fakultas dan institut",
          mission: "Aktif menyuarakan kepentingan mahasiswa Geologi dalam setiap forum senat",
          hashtag: "#SuaraMahasiswa",
          position: "senator",
        },
        {
          id: "senator_2",
          name: "Eko Prasetyo",
          photoUrl: "/candidates/senator/candidate2.jpg",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Senator yang proaktif dan responsif terhadap kebutuhan mahasiswa",
          mission: "Memperjuangkan kebijakan yang menguntungkan mahasiswa Geologi",
          hashtag: "#ProaktifResponsif",
          position: "senator",
        },
        {
          id: "senator_3",
          name: "Fitri Handayani",
          photoUrl: "/candidates/senator/candidate3.jpg",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Membawa perubahan nyata melalui komunikasi yang efektif",
          mission: "Membangun komunikasi dua arah antara mahasiswa dan pihak fakultas",
          hashtag: "#KomunikasiEfektif",
          position: "senator",
        },
      ];

      setCandidates(dummyData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      // Tetap tampilkan dummy data jika error
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

        {/* Ketua Umum BPH */}
        <section className="mb-16">
          <h2 className="mb-8 font-death-star text-3xl text-r2d2-blue">
            Calon Ketua Umum BPH
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {senatorCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} {...candidate} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
