"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer to voting day (adjust this date!)
  const votingDate = new Date("2025-12-15T00:00:00").getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = votingDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [votingDate]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Star Wars Space Background */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-gradient-to-b from-space-dark via-vader-black to-space-dark">
        {/* Animated Stars Background */}
        <div className="absolute inset-0 bg-[url('/components/navbar/stars.svg')] bg-cover opacity-40"></div>
        
        {/* Lightsaber Glow Effect */}
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-cyan-saber opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-sith-red opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-8 text-center">
          {/* Logo PEMILU GEA 2025 */}
          <div className="relative">
            <Image
              src="/images/logos/pemilu logo fix.png"
              alt="PEMILU GEA 2025 Logo"
              width={400}
              height={400}
              className="h-auto w-full max-w-xs drop-shadow-2xl md:max-w-md"
              priority
              onError={(e) => {
                // Fallback if logo not found
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-death-star text-6xl text-lightsaber-yellow drop-shadow-[0_0_10px_rgba(227,196,94,0.8)] md:text-7xl lg:text-8xl">
              PEMILU   GEA   2025
            </h1>
            <h2 className="font-helvetica-black text-2xl text-neutral-cream md:text-3xl lg:text-4xl">
              May the Force Be With You
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="mt-6 flex gap-4">
            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-[80px] flex-col items-center rounded-lg border border-metallic-gray bg-vader-black/80 p-4 backdrop-blur-sm"
              >
                <span className="font-death-star text-4xl text-lightsaber-yellow">
                  {item.value.toString().padStart(2, "0")}
                </span>
                <span className="text-sm text-neutral-cream">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button - Lightsaber Style */}
          <Link
            href="/auth/sign-in"
            className="group relative mt-6 flex h-16 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border-2 border-cyan-saber bg-gradient-to-r from-space-dark to-vader-black px-10 text-2xl font-bold text-neutral-cream shadow-[0_0_20px_rgba(43,202,224,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(43,202,224,0.8)]"
          >
            <span className="relative z-10 font-helvetica-black">Mulai Voting</span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-cyan-saber to-r2d2-blue opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </Link>

          {/* Quick Links */}
          <div className="mt-4 flex gap-4">
            <Link
              href="/kandidat"
              className="rounded-lg border border-sand-gold px-6 py-3 text-sand-gold transition-all hover:bg-sand-gold hover:text-vader-black"
            >
              Lihat Kandidat
            </Link>
            <Link
              href="/hasil"
              className="rounded-lg border border-yoda-green px-6 py-3 text-yoda-green transition-all hover:bg-yoda-green hover:text-vader-black"
            >
              Hasil Voting
            </Link>
          </div>

          {/* Info Kontak */}
          <div className="mt-8 rounded-lg border border-metallic-gray bg-vader-black/60 p-6 shadow-lg backdrop-blur-sm">
            <p className="font-helvetica-black text-base text-neutral-cream md:text-lg">
              <strong className="text-lightsaber-yellow">Kontak Panitia:</strong>
            </p>
            <p className="mt-2 text-sm text-sand-gold">
              WA: <span className="text-neutral-cream">[Nomor WA]</span> |{" "}
              Line: <span className="text-neutral-cream">[Line ID]</span> |{" "}
              Email: <span className="text-neutral-cream">[Email Panitia]</span>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-space-dark to-vader-black py-16 text-neutral-cream">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-death-star text-4xl text-lightsaber-yellow md:text-5xl">
            Tentang PEMILU GEA 2025
          </h2>
          <p className="mx-auto max-w-3xl text-center font-trade-gothic text-lg text-sand-gold">
            PEMILU GEA 2025 adalah ajang demokrasi tahunan untuk memilih Ketua Umum BPH dan Senator
            Himpunan Mahasiswa Teknik Geologi ITB periode 2025-2026. Dengan tema Star Wars,
            kami mengajak seluruh mahasiswa Geologi untuk berpartisipasi dalam menentukan
            pemimpin masa depan himpunan.
          </p>
        </div>
      </section>
    </main>
  );
}
