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
        
        <footer className="mt-auto border-t border-metallic-gray bg-vader-black p-8 text-center">
          <div className="container mx-auto">
            {/* Logo GEA ITB */}
            <Image
              src="/logos/hmtg-gea-itb.jpg"
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
