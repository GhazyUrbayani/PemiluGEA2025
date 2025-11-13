"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function HasilPage() {
  const [isVotingClosed] = useState(false); // TODO: Check dari API apakah voting sudah ditutup

  if (!isVotingClosed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-space-dark to-vader-black p-4">
        <Card className="w-full max-w-2xl border-2 border-metallic-gray bg-vader-black/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-sith-red/20 p-6">
                <Lock className="h-16 w-16 text-sith-red" />
              </div>
            </div>
            <CardTitle className="text-center font-death-star text-3xl text-lightsaber-yellow">
              HASIL BELUM TERSEDIA
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-neutral-cream">
              Hasil pemilihan akan diumumkan setelah periode voting ditutup.
            </p>
            <p className="mb-6 text-sm text-sand-gold">
              Periode voting: 1-15 Desember 2025
            </p>
            <div className="rounded-lg border border-metallic-gray bg-space-dark/60 p-4">
              <p className="text-xs text-neutral-cream">
                Sistem akan secara otomatis menghitung hasil menggunakan metode{" "}
                <strong className="text-lightsaber-yellow">
                  Instant Runoff Voting (IRV)
                </strong>{" "}
                setelah periode voting selesai.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // TODO: Tampilkan hasil real dari API
  return (
    <main className="min-h-screen bg-gradient-to-b from-space-dark to-vader-black py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="font-death-star text-5xl text-lightsaber-yellow">
            HASIL PEMILIHAN
          </h1>
          <p className="mt-2 text-sand-gold">
            Pemilihan Umum GEA 2025
          </p>
        </div>

        {/* Placeholder untuk hasil */}
        <Card className="mb-8 border-2 border-yoda-green bg-vader-black/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-death-star text-2xl text-yoda-green">
              Ketua Umum BPH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-cream">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-r2d2-blue bg-vader-black/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-death-star text-2xl text-r2d2-blue">
              Senator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-cream">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
