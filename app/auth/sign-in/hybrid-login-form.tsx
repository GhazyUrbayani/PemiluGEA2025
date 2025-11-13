"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";

export default function HybridLoginForm() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login dengan Microsoft SSO (untuk pemilih online)
   */
  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect ke Azure AD untuk authentication
      await signIn("azure-ad", {
        callbackUrl: "/vote",
        redirect: true,
      });
    } catch (error) {
      console.error("SSO login error:", error);
      toast.error("Gagal login dengan Microsoft. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  /**
   * Handle login dengan token (untuk pemilih offline)
   */
  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error("Silakan masukkan token Anda");
      return;
    }

    setIsLoading(true);

    try {
      // Panggil API backend untuk validasi token
      const response = await fetch("/api/auth/login-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login berhasil! Mengalihkan ke halaman voting...");
        // Redirect ke halaman voting
        window.location.href = "/vote";
      } else {
        toast.error(data.message || "Token tidak valid atau sudah digunakan");
      }
    } catch (error) {
      console.error("Token login error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg bg-white p-8 shadow-xl">
      {/* Opsi 1: Login Online dengan Microsoft SSO */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Untuk Pemilih Online
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Gunakan akun Microsoft ITB Anda untuk login dan memilih secara online.
        </p>
        <Button
          onClick={handleSSOLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 py-6 text-base hover:bg-blue-700"
        >
          <Image
            src="/images/microsoft-logo.svg"
            alt="Microsoft"
            width={20}
            height={20}
            className="mr-2"
          />
          Login dengan Microsoft
        </Button>
      </div>

      {/* Separator */}
      <div className="relative mb-8">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
          ATAU
        </span>
      </div>

      {/* Opsi 2: Login Offline dengan Token */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Untuk Pemilih Offline
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Jika Anda memilih secara offline melalui panitia, gunakan token unik yang diberikan.
        </p>
        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <Label htmlFor="token" className="text-gray-700">
              Token Unik
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Masukkan token yang diberikan panitia"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
              className="mt-2"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !token.trim()}
            className="w-full bg-pemilu-primary py-6 text-base font-semibold text-gray-800 hover:bg-gea-yellow"
          >
            {isLoading ? "Memproses..." : "Gunakan Token"}
          </Button>
        </form>
      </div>

      {/* Informasi Tambahan */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-600">
          <strong>Catatan:</strong> Pastikan Anda menggunakan metode login yang sesuai dengan cara Anda mendaftar. 
          Jika ada masalah, hubungi panitia PEMILU GEA 2025.
        </p>
      </div>
    </div>
  );
}
