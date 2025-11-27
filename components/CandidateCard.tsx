import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CandidateCardProps {
  id: string;
  name: string;
  photoUrl: string;
  major: string;
  batch: number;
  vision: string;
  mission: string;
}

export default function CandidateCard({
  id,
  name,
  photoUrl,
  major,
  batch,
  vision,
  mission,
}: CandidateCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col">
      <CardHeader className="relative h-64 overflow-hidden bg-white p-0 flex-shrink-0">
        <Image
          src={photoUrl}
          alt={`Foto ${name}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>

      {/* Identity Section - Fixed, tidak scroll */}
      <div className="text-center py-4 px-6 bg-white border-b-2 border-gray-100 flex-shrink-0">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {name}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {major} &apos;{String(batch).slice(-2)}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gea-blue">
          NIM: {id}
        </p>
      </div>

      {/* Scrollable Content Section */}
      <CardContent className="p-6 overflow-y-auto max-h-[400px] flex-grow space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-pemilu-primary flex items-center gap-2">
            <span className="text-lg">🎯</span> Visi
          </h4>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{vision}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-pemilu-primary flex items-center gap-2">
            <span className="text-lg">📋</span> Misi
          </h4>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{mission}</p>
        </div>
      </CardContent>
    </Card>
  );
}
