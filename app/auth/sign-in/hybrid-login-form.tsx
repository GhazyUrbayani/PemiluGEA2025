"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HybridLoginForm() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error("Silakan masukkan token Anda");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === "admin") {
          toast.success(`Selamat datang, ${data.name}!`);
          window.location.href = "/hasil";
        } else {
          toast.success("Login berhasil! Mengalihkan ke halaman voting...");
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
      <div>
        <h3 className="mb-4 text-xl font-semibold text-blue-600">
          Login dengan Token
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          Gunakan token unik yang diberikan panitia!
        </p>
        <form onSubmit={handleTokenLogin} className="space-y-4">
          <div>
            <Label htmlFor="token" className="text-gray-700">
              Token Unik
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Masukkan token Anda"
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
            className="w-full bg-pemilu-primary py-6 text-base font-semibold text-blue-600 hover:bg-gea-yellow"
          >
            {isLoading ? "Memproses..." : "Login dengan Token"}
          </Button>
        </form>
      </div>

      <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-600">
          <strong>Catatan:</strong> Jika ada masalah, hubungi panitia PEMILU GEA 2025.
        </p>
      </div>
    </div>
  );
}
