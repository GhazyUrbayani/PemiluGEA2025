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

interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  position: "kahim" | "senator";
}

// Komponen Sortable Item
function SortableItem({ id, name, index }: { id: string; name: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center gap-3 rounded-lg border-2 border-metallic-gray bg-vader-black/60 p-4 backdrop-blur-sm"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-6 w-6 text-sand-gold" />
      </button>
      <div className="flex flex-1 items-center justify-between">
        <span className="text-neutral-cream">{name}</span>
        <span className="rounded-full bg-lightsaber-yellow px-3 py-1 text-sm font-bold text-vader-black">
          Pilihan #{index + 1}
        </span>
      </div>
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

      if (result.success) {
        const kahim = result.data.filter((c: Candidate) => c.position === "kahim");
        const senator = result.data.filter((c: Candidate) => c.position === "senator");

        // Add Kotak Kosong
        kahim.push({
          id: "KOTAK_KOSONG_KAHIM",
          name: "Kotak Kosong",
          photoUrl: "/candidates/kotak-kosong.png",
          position: "kahim",
        });
        senator.push({
          id: "KOTAK_KOSONG_SENATOR",
          name: "Kotak Kosong",
          photoUrl: "/candidates/kotak-kosong.png",
          position: "senator",
        });

        setKahimCandidates(kahim);
        setSenatorCandidates(senator);

        // Initialize rankings
        setKahimRanking(kahim.map((c: Candidate) => c.id));
        setSenatorRanking(senator.map((c: Candidate) => c.id));
      }
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
                  <SortableItem key={id} id={id} name={candidate.name} index={index} />
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
                  <SortableItem key={id} id={id} name={candidate.name} index={index} />
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
