"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Users, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CandidateResult {
  id: string;
  name: string;
  photoUrl: string;
  major: string;
  batch: number;
  votes: number;
  percentage: string;
}

interface Statistics {
  totalVoters: number;
  votedCount: number;
  remainingVoters: number;
  onlineVoters: number;
  offlineVoters: number;
  participationRate: string;
}

interface ResultsData {
  kahim: CandidateResult[];
  senator: CandidateResult[];
  statistics: Statistics;
  lastUpdated: string;
}

export default function HasilPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchResults = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/hasil/results", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResultsData(data.data);
      } else {
        toast.error("Gagal memuat hasil voting");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Gagal memuat hasil voting");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Check admin authentication via cookie
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-admin", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        const data = await response.json();

        if (response.ok && data.isAdmin) {
          setIsAuthorized(true);
          // Fetch results after authentication
          await fetchResults();
        } else {
          toast.error("Anda harus login sebagai admin untuk melihat hasil");
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Error checking admin auth:", error);
        toast.error("Gagal memverifikasi akses");
        router.push("/auth/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (isLoading || !isAuthorized || !resultsData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-space-dark to-vader-black">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 animate-pulse text-mace-purple" />
          <p className="mt-4 text-neutral-cream">
            {isLoading ? "Memverifikasi akses..." : "Memuat hasil voting..."}
          </p>
        </div>
      </main>
    );
  }

  const { kahim, senator, statistics } = resultsData;

  // Prepare chart data for Ketua Umum
  const kahimChartData = kahim.map(candidate => ({
    name: candidate.name.split(" ")[0], // First name only for chart
    votes: candidate.votes,
    fullName: candidate.name,
  }));

  // Prepare chart data for Senator
  const senatorChartData = senator.map(candidate => ({
    name: candidate.name.split(" ")[0],
    votes: candidate.votes,
    fullName: candidate.name,
  }));

  const COLORS = ["#FFC107", "#4CAF50", "#2196F3", "#FF5722", "#9C27B0"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-yellow-400 mb-2 tracking-tight">
            📊 HASIL PEMILIHAN GEA 2025
          </h1>
          <p className="text-gray-300 text-lg">Real-time Voting Results</p>
          <Button
            onClick={fetchResults}
            disabled={isRefreshing}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-white mb-2" />
              <p className="text-blue-100 text-sm">Total Pemilih</p>
              <p className="text-4xl font-bold text-white">{statistics.totalVoters}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-white mb-2" />
              <p className="text-green-100 text-sm">Sudah Memilih</p>
              <p className="text-4xl font-bold text-white">{statistics.votedCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-none">
            <CardContent className="p-6 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-white mb-2" />
              <p className="text-orange-100 text-sm">Partisipasi</p>
              <p className="text-4xl font-bold text-white">{statistics.participationRate}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none">
            <CardContent className="p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-white mb-2" />
              <p className="text-purple-100 text-sm">Belum Memilih</p>
              <p className="text-4xl font-bold text-white">{statistics.remainingVoters}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ketua Umum BPH Section */}
        <Card className="mb-8 bg-gray-800 border-yellow-500 border-2">
          <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              👑 Ketua Umum BPH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Bar Chart */}
            <div className="mb-8 h-80 bg-gray-900 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kahimChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #fbbf24" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="votes" name="Jumlah Suara" radius={[8, 8, 0, 0]}>
                    {kahimChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Candidate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kahim.map((candidate) => (
                <Card key={candidate.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                        <Image
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{candidate.name}</h3>
                        <p className="text-gray-300 text-sm">{candidate.major} &apos;{String(candidate.batch).slice(-2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-4xl font-bold text-yellow-400">{candidate.votes}</span>
                          <span className="text-gray-400">votes</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {candidate.percentage}% dari total suara
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Senator Section */}
        <Card className="bg-gray-800 border-blue-500 border-2">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
              🏛️ Senator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Bar Chart */}
            <div className="mb-8 h-80 bg-gray-900 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={senatorChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #3b82f6" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="votes" name="Jumlah Suara" radius={[8, 8, 0, 0]}>
                    {senatorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Candidate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {senator.map((candidate) => (
                <Card key={candidate.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                        <Image
                          src={candidate.photoUrl}
                          alt={candidate.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{candidate.name}</h3>
                        <p className="text-gray-300 text-sm">{candidate.major} &apos;{String(candidate.batch).slice(-2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-4xl font-bold text-blue-400">{candidate.votes}</span>
                          <span className="text-gray-400">votes</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {candidate.percentage}% dari total suara
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Last updated: {new Date(resultsData.lastUpdated).toLocaleString("id-ID")}</p>
          <p className="mt-2">💡 Data ini menampilkan preferensi pertama pemilih (First Choice)</p>
        </div>
      </div>
    </main>
  );
}
