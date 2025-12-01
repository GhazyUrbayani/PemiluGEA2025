"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function VoteSuccessPage() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-space-dark to-vader-black p-4">
      <div className="max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-yoda-green/20 p-8">
            <CheckCircle className="h-24 w-24 text-yoda-green" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-4 font-death-star text-4xl text-lightsaber-yellow md:text-5xl">
          SUARA BERHASIL DICATAT!
        </h1>
        
        <p className="mb-2 text-xl text-neutral-cream">
          Terima kasih telah berpartisipasi dalam PEMILU GEA 2025
        </p>

        <p className="mb-8 font-death-star text-2xl text-sand-gold">
          May the Force Be With You
        </p>

        {/* Additional Info */}
        <div className="mb-8 rounded-lg border border-metallic-gray bg-vader-black/60 p-6 backdrop-blur-sm">
          <p className="text-sm text-neutral-cream">
            Suara Anda telah dienkripsi dan disimpan dengan aman dalam kotak suara anonim.
          </p>
          <p className="mt-2 text-sm text-sand-gold">
            Hasil pemilihan akan diumumkan setelah periode voting ditutup.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full bg-cyan-saber text-vader-black hover:bg-r2d2-blue sm:w-auto">
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/hasil">
            <Button 
              variant="outline" 
              className="w-full border-yoda-green text-yoda-green hover:bg-yoda-green hover:text-vader-black sm:w-auto"
            >
              Lihat Hasil (Coming Soon)
            </Button>
          </Link>
        </div>

        {/* Warning */}
        <p className="mt-8 text-xs text-metallic-gray">
          Anda tidak dapat melakukan voting ulang. Tombol kembali browser telah dinonaktifkan.
        </p>
      </div>
    </main>
  );
}
