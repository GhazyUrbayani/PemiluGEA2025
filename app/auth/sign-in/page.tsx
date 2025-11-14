import React from "react";
import HybridLoginForm from "./hybrid-login-form";
import { Metadata } from "next";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login | Pemilu GEA 2025",
  openGraph: {
    ...openGraphTemplate,
    title: "Login | Pemilu GEA 2025",
  },
  twitter: {
    ...twitterTemplate,
    title: "Login | Pemilu GEA 2025",
  },
};

function Page() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-gradient-to-br from-neutral-bg to-white px-8 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logos/pemilu logo fix.png"
            alt="PEMILU GEA 2025 Logo"
            width={200}
            height={200}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-yellow-600">Login untuk Memilih</h1>
          <p className="mt-2 text-sm text-yellow-400">
            Pilih metode login sesuai dengan status Anda
          </p>
        </div>

        {/* Hybrid Login Form */}
        <HybridLoginForm />
      </div>
    </main>
  );
}

export default Page;
