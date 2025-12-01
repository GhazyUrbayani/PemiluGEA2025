"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VoteForm from "./vote-form";
import { toast } from "sonner";

function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
    setIsLoading(true);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.email) {
        const validationResponse = await fetch("/api/vote/validation", {
          method: "POST",
        });
        
        if (validationResponse.ok) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        } else {
          const errorData = await validationResponse.json();
          toast.error(errorData.message || "Anda tidak terdaftar di DPT atau sudah memilih.");
          router.push("/");
          setIsLoading(false);
          return;
        }
      }

      const offlineSessionRes = await fetch("/api/auth/session-check");
      const offlineSession = await offlineSessionRes.json();

      if (offlineSession?.isAuthenticated) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      toast.error("Silakan login terlebih dahulu untuk melakukan voting");
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("Gagal memeriksa autentikasi. Silakan coba lagi.");
      router.push("/auth/sign-in");
    } finally {
      setIsLoading(false);
    }
    };

    checkAuth();
  }, [router]);

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
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-space-dark to-vader-black py-16">
      <VoteForm />
    </main>
  );
}

export default Page;
