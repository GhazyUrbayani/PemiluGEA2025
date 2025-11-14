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
  NIM: number;
}

export default function CandidateCard({
  name,
  photoUrl,
  major,
  batch,
  vision,
  mission,
  hashtag,
  NIM,
}: CandidateCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="relative h-64 overflow-hidden bg-gradient-to-br from-pemilu-primary to-gea-yellow p-0">
        <Image
          src={photoUrl}
          alt={`Foto ${name}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {hashtag && (
          <div className="absolute bottom-4 right-4 rounded-full bg-gea-blue/80 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-bold text-gea-yellow">{hashtag}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {name}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {major} &apos;{String(batch).slice(-2)}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gea-blue">
            {NIM}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-pemilu-primary">
              Visi
            </h4>
            <p className="text-sm leading-relaxed text-gray-700">{vision}</p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-pemilu-primary">
              Misi
            </h4>
            <p className="text-sm leading-relaxed text-gray-700">{mission}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
