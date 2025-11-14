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
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      // Check NextAuth session (Azure AD)
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (session?.user?.email) {
        // User logged in via Azure AD - check if eligible voter
        const validationResponse = await fetch("/api/vote/validation", {
          method: "POST",
        });
        
        if (validationResponse.ok) {
          setIsAuthenticated(true);
          return;
        } else {
          const errorData = await validationResponse.json();
          toast.error(errorData.message || "Anda tidak terdaftar di DPT");
          router.push("/");
          return;
        }
      }

      // Check offline token session
      const voterSession = document.cookie
        .split("; ")
        .find((row) => row.startsWith("voter-session="));
      
      if (voterSession) {
        // Verify token with backend
        const tokenValidation = await fetch("/api/auth/login-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: voterSession.split("=")[1] }),
        });

        if (tokenValidation.ok) {
          setIsAuthenticated(true);
          return;
        }
      }

      // No valid session
      toast.error("Silakan login terlebih dahulu untuk melakukan voting");
      router.push("/auth/sign-in");
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
      <VoteForm />
    </main>
  );
}

export default Page;
