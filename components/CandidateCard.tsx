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
  hashtag?: string;
}

export default function CandidateCard({
  id,
  name,
  photoUrl,
  major,
  batch,
  vision,
  mission,
  hashtag,
}: CandidateCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
      <CardHeader className="relative h-64 overflow-hidden bg-white p-0 flex-shrink-0">
        <Image
          src={photoUrl}
          alt={`Foto ${name}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {hashtag && (
          <div className="absolute bottom-4 right-4 rounded-full bg-gea-blue/80 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-bold text-gea-yellow">{hashtag}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-6 overflow-y-auto max-h-[500px] flex-grow">
        <div className="text-center sticky top-0 bg-white pb-3 z-10">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {name}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {major} &apos;{String(batch).slice(-2)}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gea-blue">
            NIM: {id}
          </p>
        </div>

        <div className="space-y-4">
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
        </div>
        
        {/* Scroll indicator */}
        <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </CardContent>
    </Card>
  );
}
