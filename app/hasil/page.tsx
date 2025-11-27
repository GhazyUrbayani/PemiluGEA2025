"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield } from "lucide-react";
import { toast } from "sonner";

export default function HasilPage() {
  const router = useRouter();
  const [isVotingClosed] = useState(false); // TODO: Check dari API apakah voting sudah ditutup
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check admin authentication via cookie
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-admin", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        const data = await response.json();

        if (response.ok && data.isAdmin) {
          setIsAuthorized(true);
        } else {
          toast.error("Anda harus login sebagai admin untuk melihat hasil");
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Error checking admin auth:", error);
        toast.error("Gagal memverifikasi akses");
        router.push("/auth/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (isLoading || !isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-space-dark to-vader-black">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 animate-pulse text-mace-purple" />
          <p className="mt-4 text-neutral-cream">Memverifikasi akses...</p>
        </div>
      </main>
    );
  }

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
