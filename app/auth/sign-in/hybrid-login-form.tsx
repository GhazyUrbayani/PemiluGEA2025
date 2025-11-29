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
   * Handle login dengan Google SSO (untuk pemilih online)
   */
  const handleSSOLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect ke Google untuk authentication
      await signIn("google", {
        callbackUrl: "/vote",
        redirect: true,
      });
    } catch (error) {
      console.error("SSO login error:", error);
      toast.error("Gagal login dengan Google. Silakan coba lagi.");
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
        // Check if login is admin or voter
        if (data.role === "admin") {
          toast.success(`Selamat datang, ${data.name}!`);
          // Redirect admin ke halaman hasil
          window.location.href = "/hasil";
        } else {
          toast.success("Login berhasil! Mengalihkan ke halaman voting...");
          // Redirect voter ke halaman voting
          window.location.href = "/vote";
        }
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
      {/* Opsi 1: Login Online dengan Google SSO */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Untuk Pemilih Online
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Gunakan akun Google ITB Anda untuk login dan memilih secara online.
        </p>
        <Button
          onClick={handleSSOLogin}
          disabled={isLoading}
          className="w-full bg-white border-2 border-gray-300 text-gray-800 py-6 text-base hover:bg-gray-50"
        >
          <svg className="mr-2" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login dengan Google
        </Button>
      </div>

      {/* Separator */}
      <div className="relative mb-8">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
          ATAU
        </span>
      </div>

      {/* Opsi 2: Login dengan Token */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Login dengan Token
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Gunakan token unik yang diberikan untuk:
        </p>
        <ul className="mb-4 space-y-1 text-sm text-gray-600">
          <li>• <strong>Pemilih Offline:</strong> Token 5-7 digit angka dari panitia</li>
          <li>• <strong>Panitia:</strong> Token admin untuk akses hasil voting</li>
        </ul>
        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <Label htmlFor="token" className="text-gray-700">
              Token Unik (5-7 digit angka atau admin token)
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Contoh: 12345 atau pemilskuy"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
              className="mt-2 text-center text-lg font-mono tracking-wider"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !token.trim()}
            className="w-full bg-pemilu-primary py-6 text-base font-semibold text-gray-800 hover:bg-gea-yellow"
          >
            {isLoading ? "Memproses..." : "Login dengan Token"}
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
