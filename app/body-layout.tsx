"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";
import Image from "next/image";
import "./globals.css";

function BodyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <body className="bg-space-dark font-trade-gothic text-neutral-cream antialiased">
        <Navbar />
        {children}
        <Toaster />
        
        {/* Footer - Star Wars Theme */}
        <footer className="mt-auto border-t border-metallic-gray bg-vader-black p-8 text-center">
          <div className="container mx-auto">
            {/* Logo GEA ITB */}
            <Image
              src="/images/logos/hmtg-gea-itb.jpg"
              alt="HMTG GEA ITB Logo"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full border-2 border-sand-gold"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            
            <p className="font-helvetica-black text-sm text-sand-gold">
              &copy; 2025 Himpunan Mahasiswa Teknik Geologi ITB
            </p>
            <p className="mt-2 font-trade-gothic text-xs text-metallic-gray">
              PEMILU GEA 2025 - Star Wars Edition
            </p>
            
            <div className="mt-6 text-xs text-sand-gold">
              <p className="font-helvetica-black mb-2">Kontak Panitia PEMILU GEA 2025</p>
              <p className="text-metallic-gray">
                WA: <span className="text-neutral-cream">[Nomor WA]</span> |{" "}
                Line: <span className="text-neutral-cream">[Line ID]</span> |{" "}
                Email: <span className="text-neutral-cream">[Email Panitia]</span>
              </p>
            </div>

            {/* May the Force */}
            <p className="mt-6 font-death-star text-lg text-cyan-saber">
              May the Force Be With You
            </p>
          </div>
        </footer>
      </body>
    </SessionProvider>
  );
}

export default BodyLayout;
