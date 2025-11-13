import { type Metadata } from "next";

export const openGraphTemplate: Metadata["openGraph"] = {
  description:
    'Selamat datang di Website Resmi Pemilu HMTG "GEA" ITB 2024, tempat kamu bisa menemukan semua informasi terkait pemilihan ketua dan senator berikutnya! Temui para kandidat, pelajari visi dan misi mereka, dan jadilah bagian dari perjalanan demokrasi kampus yang seru.',
  url: "https://pemilu-gea-2024.vercel.app/",
  siteName: "Pemilu GEA 2024",
  locale: "id-ID",
  type: "website",
  images: {
    url: "https://pemilu-gea-2024.vercel.app/logo/link-preview.png",
    width: "1200",
    height: "630",
    alt: "Pemilu GEA 2024 Logo",
  },
};

export const twitterTemplate: Metadata["twitter"] = {
  card: "summary_large_image",
  description:
    'Selamat datang di Website Resmi Pemilu HMTG "GEA" ITB 2024, tempat kamu bisa menemukan semua informasi terkait pemilihan ketua dan senator berikutnya! Temui para kandidat, pelajari visi dan misi mereka, dan jadilah bagian dari perjalanan demokrasi kampus yang seru.',
  images: {
    url: "https://pemilu-gea-2024.vercel.app/logo/link-preview.png",
    alt: "Pemilu GEA 2024 Logo",
  },
};
