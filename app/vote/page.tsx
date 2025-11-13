"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VoteForm from "./vote-form";
import { toast } from "sonner";

// DUMMY TOKEN HARDCODE - HAPUS NANTI!
const DUMMY_TOKEN = "TESTTOKEN123";

function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      // Check session from cookie or NextAuth
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        // Check if there's a voter-session cookie (for token login)
        const voterSession = document.cookie
          .split("; ")
          .find((row) => row.startsWith("voter-session="));
        
        if (voterSession) {
          // Has voter session from token login
          setIsAuthenticated(true);
        } else {
          // No session, redirect to login
          toast.error("Silakan login terlebih dahulu");
          router.push("/auth/sign-in");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Gagal memeriksa autentikasi");
      router.push("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-space-dark to-vader-black">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-lightsaber-yellow border-t-transparent"></div>
          <p className="mt-4 text-neutral-cream">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-space-dark to-vader-black py-16">
      {/* DUMMY TOKEN WARNING - HAPUS NANTI */}
      <div className="container mx-auto mb-4 max-w-4xl">
        <div className="rounded-lg border-2 border-sith-red bg-sith-red/20 p-4 text-center">
          <p className="text-sm text-neutral-cream">
            <strong className="text-sith-red">⚠️ DEVELOPMENT MODE:</strong> Using dummy token: <code className="bg-vader-black px-2 py-1">{DUMMY_TOKEN}</code>
          </p>
          <p className="text-xs text-sand-gold">Hapus bagian ini setelah implementasi selesai!</p>
        </div>
      </div>
      <VoteForm />
    </main>
  );
}

export default Page;
