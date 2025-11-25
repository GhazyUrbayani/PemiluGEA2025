"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUp, X } from "lucide-react";

// Tipe data kandidat
interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  major?: string;
  batch?: number;
  hashtag?: string;
  position: "kahim" | "senator";
}

interface VoteFormProps {
  candidates: Candidate[];
  voteType: "kahim" | "senator";
  onNext: (rankings: string[]) => void;
  isLastStep?: boolean;
}

export default function VoteForm({ candidates, voteType, onNext, isLastStep }: VoteFormProps) {
  const router = useRouter();
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter kandidat yang BELUM dipilih untuk ditampilkan di area bawah
  const availableCandidates = candidates.filter(
    (c) => !rankedCandidates.find((r) => r.id === c.id)
  );

  // Fungsi: Masukkan kandidat ke daftar peringkat (Klik dari Bawah -> Atas)
  const handleSelect = (candidate: Candidate) => {
    setRankedCandidates([...rankedCandidates, candidate]);
  };

  // Fungsi: Batalkan pilihan (Klik dari Atas -> Bawah)
  const handleDeselect = (candidate: Candidate) => {
    setRankedCandidates(rankedCandidates.filter((c) => c.id !== candidate.id));
  };

  const handleSubmit = async () => {
    if (rankedCandidates.length === 0) {
      toast.error("Pilih setidaknya satu kandidat atau Kotak Kosong!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Kirim array ID kandidat yang sudah terurut
      const rankingIds = rankedCandidates.map((c) => c.id);
      await onNext(rankingIds);
    } catch (error) {
      toast.error("Gagal menyimpan pilihan.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- AREA 1: PILIHAN ANDA (RANKING) --- */}
      <div className="bg-space-dark/40 border border-gold-sand/30 rounded-xl p-4 md:p-6 sticky top-20 z-10 backdrop-blur-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-death-star text-lightsaber-yellow tracking-widest">
            URUTAN PILIHAN ANDA
          </h3>
          <span className="text-xs text-sand-gold/70 font-tango">
            Klik untuk membatalkan
          </span>
        </div>

        {rankedCandidates.length === 0 ? (
          <div className="border-2 border-dashed border-gray-600 rounded-lg h-32 flex flex-col items-center justify-center text-gray-500 bg-black/20">
            <ArrowUp className="w-8 h-8 mb-2 opacity-50 animate-bounce" />
            <p className="font-tango text-sm">Klik kandidat di bawah untuk memilih</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rankedCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                onClick={() => handleDeselect(candidate)}
                className="group flex items-center gap-4 bg-gradient-to-r from-gea-blue to-space-dark p-3 rounded-lg border border-gold-sand/50 cursor-pointer hover:bg-red-900/40 transition-all hover:border-red-500"
              >
                {/* Badge Nomor Urut */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-lightsaber-yellow text-space-dark font-death-star text-xl rounded-full shadow-lg border-2 border-white">
                  {index + 1}
                </div>

                {/* Info Kandidat Mini */}
                <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden border border-gray-400">
                   <Image src={candidate.photoUrl} alt={candidate.name} fill className="object-cover" />
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-bold text-white text-sm md:text-base uppercase truncate">
                    {candidate.name}
                  </h4>
                  {candidate.hashtag && (
                    <p className="text-xs text-r2d2-blue">#{candidate.hashtag}</p>
                  )}
                </div>

                <div className="mr-2">
                  <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SEPARATOR --- */}
      <div className="relative flex items-center justify-center py-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        <span className="absolute px-4 bg-[#1a1a1a] text-gray-500 text-xs font-tango uppercase tracking-widest">
          Daftar Kandidat Tersedia
        </span>
      </div>

      {/* --- AREA 2: DAFTAR KANDIDAT (AVAILABLE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableCandidates.map((candidate) => (
          <div
            key={candidate.id}
            onClick={() => handleSelect(candidate)}
            className="cursor-pointer group relative overflow-hidden rounded-xl bg-space-dark/50 border border-gray-700 hover:border-lightsaber-yellow hover:shadow-[0_0_15px_rgba(227,196,94,0.3)] transition-all duration-200 active:scale-95"
          >
            <div className="flex p-4 gap-4 items-center">
              {/* Foto Besar */}
              <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-600">
                <Image
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Detail */}
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-bold text-white font-death-star uppercase leading-tight mb-1 group-hover:text-lightsaber-yellow transition-colors">
                  {candidate.name}
                </h4>
                {candidate.major && (
                   <p className="text-xs text-r2d2-blue font-tango mb-2">
                     {candidate.major} {candidate.batch}
                   </p>
                )}
                <div className="inline-flex items-center text-xs font-bold text-space-dark bg-gray-200 px-3 py-1 rounded-full w-max group-hover:bg-lightsaber-yellow transition-colors">
                  PILIH +
                </div>
              </div>
            </div>
          </div>
        ))}

        {availableCandidates.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 italic">
                Semua kandidat sudah dipilih.
            </div>
        )}
      </div>

      {/* --- TOMBOL AKSI --- */}
      <div className="pt-6 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rankedCandidates.length === 0}
          className="bg-gradient-to-r from-lightsaber-yellow to-orange-500 text-black font-bold px-8 py-6 rounded-lg text-lg hover:shadow-[0_0_20px_rgba(227,196,94,0.6)] transition-all w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...
            </>
          ) : isLastStep ? (
            "Kirim Suara 🚀"
          ) : (
            "Lanjut ke Senator 👉"
          )}
        </Button>
      </div>

    </div>
  );
}