"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  position: "kahim" | "senator";
  major?: string;
  batch?: number;
  vision?: string;
  mission?: string;
  hashtag?: string;
}

// Komponen Sortable Item with Card
function SortableItem({ candidate, index }: { candidate: Candidate; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4"
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute right-2 top-2 z-10 rounded-full bg-lightsaber-yellow px-4 py-2 text-sm font-bold text-vader-black shadow-lg">
          Pilihan #{index + 1}
        </div>
        <div className="absolute left-2 top-2 z-10" {...attributes} {...listeners}>
          <button className="cursor-grab rounded-lg bg-vader-black/80 p-2 backdrop-blur-sm hover:bg-vader-black active:cursor-grabbing">
            <GripVertical className="h-6 w-6 text-sand-gold" />
          </button>
        </div>
        <CardHeader className="relative h-48 overflow-hidden bg-gradient-to-br from-pemilu-primary to-gea-yellow p-0">
          <Image
            src={candidate.photoUrl}
            alt={`Foto ${candidate.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {candidate.hashtag && (
            <div className="absolute bottom-4 right-4 rounded-full bg-gea-blue/80 px-4 py-2 backdrop-blur-sm">
              <p className="text-sm font-bold text-gea-yellow">{candidate.hashtag}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3 p-4">
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-gray-800">
              {candidate.name}
            </CardTitle>
            {candidate.major && candidate.batch && (
              <p className="text-sm text-gray-600">
                {candidate.major} &apos;{String(candidate.batch).slice(-2)}
              </p>
            )}
          </div>

          {candidate.vision && (
            <div>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-pemilu-primary">
                Visi
              </h4>
              <p className="text-xs leading-relaxed text-gray-700">{candidate.vision}</p>
            </div>
          )}

          {candidate.mission && (
            <div>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-pemilu-primary">
                Misi
              </h4>
              <p className="text-xs leading-relaxed text-gray-700">{candidate.mission}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VoteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [kahimCandidates, setKahimCandidates] = useState<Candidate[]>([]);
  const [senatorCandidates, setSenatorCandidates] = useState<Candidate[]>([]);

  // State untuk ranking
  const [kahimRanking, setKahimRanking] = useState<string[]>([]);
  const [senatorRanking, setSenatorRanking] = useState<string[]>([]);

  // Fetch candidates
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      const result = await response.json();

      let kahim: Candidate[] = [];
      let senator: Candidate[] = [];

      if (result.success && result.data) {
        kahim = result.data.filter((c: Candidate) => c.position === "kahim");
        senator = result.data.filter((c: Candidate) => c.position === "senator");
      } else {
        // Fallback dummy data if API fails
        kahim = [
          {
            id: "12023026",
            name: "Geraldus Yudhistira Davin",
            photoUrl: "/Davin.png",
            major: "Teknik Geologi",
            batch: 2023,
            vision: "Mewujudkan GEA yang inklusif, inovatif, dan berdampak bagi mahasiswa Teknik Geologi ITB",
            mission: "1. Meningkatkan partisipasi aktif anggota dalam kegiatan himpunan\n2. Memperkuat sinergi dengan alumni dan industri\n3. Mengembangkan program pengembangan soft skill dan hard skill",
            hashtag: "#GerakBersama",
            position: "kahim",
          },
        ];
        senator = [
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
      }

      // Add Kotak Kosong
      kahim.push({
        id: "KOTAK_KOSONG_KAHIM",
        name: "Kotak Kosong",
        photoUrl: "/logos/pemilu logo fix.png",
        position: "kahim",
      });
      senator.push({
        id: "KOTAK_KOSONG_SENATOR",
        name: "Kotak Kosong",
        photoUrl: "/logos/pemilu logo fix.png",
        position: "senator",
      });

      setKahimCandidates(kahim);
      setSenatorCandidates(senator);

      // Initialize rankings
      setKahimRanking(kahim.map((c: Candidate) => c.id));
      setSenatorRanking(senator.map((c: Candidate) => c.id));
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Gagal memuat data kandidat");
    } finally {
      setIsFetching(false);
    }
  };

  // Handle drag end for Kahim
  const handleKahimDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setKahimRanking((items) => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Handle drag end for Senator
  const handleSenatorDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSenatorRanking((items) => {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Submit vote
  const handleSubmit = async () => {
    if (!kahimRanking.length || !senatorRanking.length) {
      toast.error("Pilihan tidak boleh kosong!");
      return;
    }

    // Confirmation
    const confirmed = window.confirm(
      "Apakah Anda yakin dengan pilihan Anda?\n\n" +
      "Ketua Umum:\n" +
      kahimRanking.map((id, idx) => `${idx + 1}. ${kahimCandidates.find(c => c.id === id)?.name}`).join("\n") +
      "\n\nSenator:\n" +
      senatorRanking.map((id, idx) => `${idx + 1}. ${senatorCandidates.find(c => c.id === id)?.name}`).join("\n")
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      // TODO: Kirim ke API /api/vote/submit
      const response = await fetch("/api/vote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ketuaUmum: kahimRanking,
          senator: senatorRanking,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Suara berhasil dicatat!");
        router.push("/vote/success");
      } else {
        toast.error(data.error || "Gagal mengirim suara");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengirim suara");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-lightsaber-yellow border-t-transparent"></div>
          <p className="mt-4 text-neutral-cream">Memuat data kandidat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <div className="text-center">
        <h1 className="font-death-star text-4xl text-lightsaber-yellow md:text-5xl">
          PEMILIHAN SUARA
        </h1>
        <p className="mt-2 text-sand-gold">
          Drag kandidat untuk mengurutkan preferensi Anda
        </p>
        <p className="text-sm text-neutral-cream">
          Pilihan #1 = Preferensi Tertinggi
        </p>
      </div>

      {/* Ketua Umum BPH */}
      <Card className="border-2 border-lightsaber-yellow bg-space-dark/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-death-star text-2xl text-lightsaber-yellow">
            Ketua Umum BPH
          </CardTitle>
          <p className="text-sm text-sand-gold">
            Urutkan kandidat sesuai preferensi Anda (drag & drop)
          </p>
        </CardHeader>
        <CardContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleKahimDragEnd}>
            <SortableContext items={kahimRanking} strategy={verticalListSortingStrategy}>
              {kahimRanking.map((id, index) => {
                const candidate = kahimCandidates.find(c => c.id === id);
                return candidate ? (
                  <SortableItem key={id} candidate={candidate} index={index} />
                ) : null;
              })}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      {/* Senator */}
      <Card className="border-2 border-r2d2-blue bg-space-dark/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-death-star text-2xl text-r2d2-blue">
            Senator
          </CardTitle>
          <p className="text-sm text-sand-gold">
            Urutkan kandidat sesuai preferensi Anda (drag & drop)
          </p>
        </CardHeader>
        <CardContent>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleSenatorDragEnd}>
            <SortableContext items={senatorRanking} strategy={verticalListSortingStrategy}>
              {senatorRanking.map((id, index) => {
                const candidate = senatorCandidates.find(c => c.id === id);
                return candidate ? (
                  <SortableItem key={id} candidate={candidate} index={index} />
                ) : null;
              })}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-14 w-full max-w-md bg-gradient-to-r from-yoda-green to-cyan-saber text-xl font-bold text-vader-black hover:scale-105 hover:shadow-[0_0_30px_rgba(111,195,109,0.8)]"
        >
          {isLoading ? "Mengirim..." : "Kirim Suara"}
        </Button>
      </div>
    </div>
  );
}
