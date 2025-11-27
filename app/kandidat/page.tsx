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
      

      const Data: Candidate[] = [
        {
          id: "12023026",
          name: "Geraldus Yudhistira Davin",
          photoUrl: "/Davin.png",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Mewujudkan HMTG \"GEA\" ITB yang berdikari dan profesional melalui lingkungan yang inklusif dalam rangka mewujudkan Keberdampakan yang Absolut.",
          mission: "1. Mempersiapkan Anggota HMTG \"GEA\" ITB sebagai calon sarjana dan geologis untuk mewujudkan pribadi yang profesional, cakap, berkarakter dan dapat berdampak bagi lingkungannya.\n\n2. Merancang kaderisasi yang bertujuan untuk mempersiapkan kader untuk menjadi Anggota Biasa HMTG \"GEA\" ITB yang cakap dan berkarakter.\n\n3. Memaksimalkan potensi diri Anggota Biasa HMTG \"GEA\" ITB dalam rangka menjadikan pribadi yang berdampak.\n\n4. Memaksimalkan potensi dan implementasi dari Anggota Biasa HMTG \"GEA\" ITB di bidang keilmuan geologi dan non-geologi untuk mewujudkan keberdampakan yang absolut.\n\n5. Menciptakan lingkungan yang menjunjung tinggi nilai kekeluargaan untuk mewujudkan HMTG \"GEA\" ITB yang inklusif.\n\n6. Mengusahakan pemenuhan kebutuhan dasar Anggota HMTG \"GEA\" ITB untuk mewujudkan kesejahteraan Anggota Biasa HMTG \"GEA\" ITB\n\n7. Menciptakan citra GEA yang profesional dan bermartabat secara nyata di lingkungan eksternal HMTG \"GEA\" ITB.\n\n8. Merancang sistem kesekretariatan yang terpadu dan transparan bagi Anggota Biasa HMTG \"GEA\" ITB.\n\n9. Merancang pengemasan informasi seputar HMTG \"GEA\" ITB yang informatif dan menarik bagi Anggota Biasa HMTG \"GEA\" ITB serta massa eksternal HMTG \"GEA\" ITB.",
          position: "kahim",
        },
        {
          id: "12023075",
          name: "Albert Kamaruddin",
          photoUrl: "/Albert.png",
          major: "Teknik Geologi",
          batch: 2023,
          vision: "Badan Kesenatoran HMTG \"GEA\" ITB sebagai penyedia wadah aspiratif dan informatif untuk GEA mengetahui dunia dalam langkah menguasai dunia serta bentuk manifestasi suara HMTG \"GEA\" ITB dalam Kongres KM ITB",
          mission: "1. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB sebagai wadah terbuka yang mampu mendengar, memahami, menghimpun, mengolah, dan menyuarakan aspirasi seluruh anggota biasa HMTG \"GEA\" ITB.\n\n2. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang informatif dan transparan dalam mencerdaskan anggota biasa HMTG \"GEA\" ITB terhadap isu di KM ITB ataupun Nasional yang dapat mengganggu kehidupan berkemahasiswaan anggota biasa HMTG \"GEA\" ITB.\n\n3. Mewujudkan Badan Kesenatoran HMTG \"GEA\" ITB yang komunikatif dengan lembaga luar dan dalam HMTG \"GEA\" ITB untuk membuka ruang pembelajaran dan perkembangan diri oleh anggotanya dan badan itu sendiri.",
          position: "senator",
        },
      ];

      setCandidates(Data);
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
