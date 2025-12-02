"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
   
}

function CandidateCard({ 
  candidate, 
  rank, 
  onClick,
  isSelected 
}: { 
  candidate: Candidate; 
  rank?: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <Card 
      onClick={onClick}
      className={`group relative overflow-hidden transition-all duration-300 cursor-pointer transform ${
        isSelected 
          ? 'ring-4 ring-lightsaber-yellow shadow-2xl scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 animate-pulse-slow' 
          : 'hover:shadow-xl hover:scale-[1.02] opacity-70 hover:opacity-100 hover:ring-2 hover:ring-gray-300 active:scale-95'
      }`}
    >
      {!isSelected && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 z-20">
          <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg">
            <p className="text-sm font-bold text-gray-700">👆 Ketuk untuk Pilih</p>
          </div>
        </div>
      )}
      {rank && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2.5 text-base font-extrabold text-white shadow-2xl animate-bounce-subtle border-2 border-white">
          ✓ Pilihan #{rank}
        </div>
      )}
      
      {isSelected && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-green-500 p-2 shadow-xl animate-scale-in">
          <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      
      <CardHeader className={`relative h-48 overflow-hidden p-0 flex-shrink-0 ${
        isSelected ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-white'
      }`}>
        <Image
          src={candidate.photoUrl}
          alt={`Foto ${candidate.name}`}
          fill
          className={`object-contain transition-all duration-300 ${
            isSelected ? 'scale-110 brightness-110' : 'group-hover:scale-105'
          }`}
        />
      </CardHeader>

      <div className={`text-center py-3 px-4 border-b-2 flex-shrink-0 ${
        isSelected 
          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-orange-200' 
          : 'bg-white border-gray-100'
      }`}>
        <CardTitle className={`text-lg font-bold transition-colors ${
          isSelected ? 'text-orange-700' : 'text-gray-800'
        }`}>
          {candidate.name}
        </CardTitle>
        {candidate.major && candidate.batch && (
          <p className="text-xs text-gray-600 mt-0.5">
            {candidate.major} &apos;{String(candidate.batch).slice(-2)}
          </p>
        )}
      </div>

      <CardContent className={`p-4 overflow-y-auto max-h-80 flex-grow space-y-3 ${
        isSelected ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-white'
      }`}>
        {candidate.vision && (
          <div className="bg-blue-50/50 p-3 rounded-lg">
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-pemilu-primary flex items-center gap-1">
              <span>🎯</span> Visi
            </h4>
            <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-line">{candidate.vision}</p>
          </div>
        )}

        {candidate.mission && (
          <div className="bg-green-50/50 p-3 rounded-lg">
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-pemilu-primary flex items-center gap-1">
              <span>📋</span> Misi
            </h4>
            <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-line">{candidate.mission}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VoteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [kahimCandidates, setKahimCandidates] = useState<Candidate[]>([]);
  const [senatorCandidates, setSenatorCandidates] = useState<Candidate[]>([]);
  const [selectedKahim, setSelectedKahim] = useState<string[]>([]);
  const [selectedSenator, setSelectedSenator] = useState<string[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      const result = await response.json();

      let kahim: Candidate[] = [];
      let senator: Candidate[] = [];

      const candidateData = result.data || result.candidates || [];
      
      if (candidateData.length > 0) {
        kahim = candidateData.filter((c: Candidate) => c.position === "kahim");
        senator = candidateData.filter((c: Candidate) => c.position === "senator");
      }
      
      if (kahim.length === 0) {
        kahim = [
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
        ];
      }
      
      if (senator.length === 0) {
        senator = [
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
      }

      setKahimCandidates(kahim);
      setSenatorCandidates(senator);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Gagal memuat data kandidat");
    } finally {
      setIsFetching(false);
    }
  };

  const handleKahimSelect = (candidateId: string) => {
    const candidate = kahimCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    if (selectedKahim.includes(candidateId)) {
      setSelectedKahim([]);
      toast.info(`"${candidate.name}" dibatalkan dari pilihan Ketua Umum`, {
        duration: 2000,
      });
    } else {
      setSelectedKahim([candidateId]);
      toast.success(`✓ "${candidate.name}" dipilih untuk Ketua Umum`, {
        duration: 2000,
      });
    }
  };

  const handleSenatorSelect = (candidateId: string) => {
    const candidate = senatorCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    if (selectedSenator.includes(candidateId)) {
      setSelectedSenator([]);
      toast.info(`"${candidate.name}" dibatalkan dari pilihan Senator`, {
        duration: 2000,
      });
    } else {
      setSelectedSenator([candidateId]);
      toast.success(`✓ "${candidate.name}" dipilih untuk Senator`, {
        duration: 2000,
      });
    }
  };

  const availableKahim = kahimCandidates.filter(c => !selectedKahim.includes(c.id));
  const availableSenator = senatorCandidates.filter(c => !selectedSenator.includes(c.id));

  const handleSubmit = async () => {
    if (!selectedKahim.length || !selectedSenator.length) {
      toast.error("Pilihan tidak boleh kosong!");
      return;
    }

    const kahimChoice = kahimCandidates.find(c => c.id === selectedKahim[0])?.name || "Tidak dipilih";
    const senatorChoice = senatorCandidates.find(c => c.id === selectedSenator[0])?.name || "Tidak dipilih";
    
    const confirmed = window.confirm(
      "Apakah Anda yakin dengan pilihan Anda?\n\n" +
      "Ketua Umum: " + kahimChoice + "\n" +
      "Senator: " + senatorChoice + "\n\n" +
      "⚠️ PILIHAN ANDA TIDAK DAPAT DIUBAH setelah submit!"
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/vote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ketuaUmum: selectedKahim,
          senator: selectedSenator,
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
      <div className="text-center space-y-4">
        <h1 className="font-death-star text-4xl text-lightsaber-yellow md:text-5xl">
          PEMILIHAN SUARA
        </h1>
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-400">
          <p className="text-lg font-bold text-orange-700 mb-2">
            📱 Cara Memilih (Single Choice):
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p>✅ <strong>Pilih 1 kandidat</strong> untuk Ketua Umum</p>
            <p>✅ <strong>Pilih 1 kandidat</strong> untuk Senator</p>
            <p>🔄 <strong>Ketuk lagi</strong> untuk ganti pilihan</p>
            <p>⚠️ <strong>Boleh memilih Kotak Kosong</strong> jika tidak ingin memilih kandidat</p>
          </div>
        </div>
      </div>

      {/* Ketua Umum BPH */}
      <Card className="border-2 border-lightsaber-yellow bg-space-dark/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-death-star text-2xl text-lightsaber-yellow">
              Ketua Umum BPH
            </CardTitle>
            <div className="rounded-full bg-lightsaber-yellow px-4 py-2">
              <span className="text-sm font-bold text-vader-black">
                {selectedKahim.length > 0 ? "✓ Sudah dipilih" : "Belum dipilih"}
              </span>
            </div>
          </div>
          <p className="text-sm text-sand-gold">
            Ketuk kandidat di bawah untuk memilih
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Area Pilihan Terpilih */}
          {selectedKahim.length > 0 && (
            <div className="space-y-3 rounded-xl bg-gradient-to-r from-yellow-100/50 to-orange-100/50 p-4 border-2 border-yellow-300">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-1.5">
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-orange-700">
                  Pilihan Anda
                </h3>
                <span className="text-sm text-orange-600 ml-auto">(ketuk untuk membatalkan)</span>
              </div>
              <div className="space-y-4">
                {selectedKahim.map((id, index) => {
                  const candidate = kahimCandidates.find(c => c.id === id);
                  return candidate ? (
                    <CandidateCard
                      key={id}
                      candidate={candidate}
                      rank={index + 1}
                      onClick={() => handleKahimSelect(id)}
                      isSelected={true}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Area Kandidat Tersedia */}
          {availableKahim.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-cream flex items-center gap-2">
                <span className="text-2xl">👆</span>
                Kandidat Tersedia - Ketuk untuk Memilih
              </h3>
              <div className="space-y-4">
                {availableKahim.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => handleKahimSelect(candidate.id)}
                    isSelected={false}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Senator */}
      <Card className="border-2 border-r2d2-blue bg-space-dark/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-death-star text-2xl text-r2d2-blue">
              Senator
            </CardTitle>
            <div className="rounded-full bg-r2d2-blue px-4 py-2">
              <span className="text-sm font-bold text-white">
                {selectedSenator.length > 0 ? "✓ Sudah dipilih" : "Belum dipilih"}
              </span>
            </div>
          </div>
          <p className="text-sm text-sand-gold">
            Pilih 1 kandidat atau Kotak Kosong
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Area Pilihan Terpilih */}
          {selectedSenator.length > 0 && (
            <div className="space-y-3 rounded-xl bg-gradient-to-r from-blue-100/50 to-cyan-100/50 p-4 border-2 border-blue-300">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-500 p-1.5">
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-blue-700">
                  Pilihan Anda
                </h3>
                <span className="text-sm text-blue-600 ml-auto">(ketuk untuk membatalkan)</span>
              </div>
              <div className="space-y-4">
                {selectedSenator.map((id, index) => {
                  const candidate = senatorCandidates.find(c => c.id === id);
                  return candidate ? (
                    <CandidateCard
                      key={id}
                      candidate={candidate}
                      rank={index + 1}
                      onClick={() => handleSenatorSelect(id)}
                      isSelected={true}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Area Kandidat Tersedia */}
          {availableSenator.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-cream flex items-center gap-2">
                <span className="text-2xl">👆</span>
                Kandidat Tersedia - Ketuk untuk Memilih
              </h3>
              <div className="space-y-4">
                {availableSenator.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => handleSenatorSelect(candidate.id)}
                    isSelected={false}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex flex-col items-center gap-4">
        {/* Summary sebelum submit */}
        <div className="w-full max-w-md bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 border-2 border-green-400">
          <p className="text-center font-bold text-gray-800 mb-2">Ringkasan Pilihan Anda:</p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              🏛️ <strong>Ketua Umum:</strong>{" "}
              {selectedKahim.length > 0 
                ? kahimCandidates.find(c => c.id === selectedKahim[0])?.name 
                : "Belum dipilih"}
            </p>
            <p>
              👥 <strong>Senator:</strong>{" "}
              {selectedSenator.length > 0 
                ? senatorCandidates.find(c => c.id === selectedSenator[0])?.name 
                : "Belum dipilih"}
            </p>
          </div>
          {(!selectedKahim.length || !selectedSenator.length) && (
            <p className="text-xs text-red-600 mt-2 text-center font-semibold">
              ⚠️ Harap pilih 1 kandidat untuk setiap posisi
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !selectedKahim.length || !selectedSenator.length}
          className="h-14 w-full max-w-md bg-gradient-to-r from-yoda-green to-cyan-saber text-xl font-bold text-vader-black hover:scale-105 hover:shadow-[0_0_30px_rgba(111,195,109,0.8)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Mengirim..." : "🗳️ Kirim Suara Sekarang"}
        </Button>
      </div>
    </div>
  );
}
