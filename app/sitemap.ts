import { MetadataRoute } from "next";

const BASE_URL = "https://pemilu-gea-2024.vercel.app";

const urls = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    priority: 1,
  },
  {
    url: `${BASE_URL}/access-control`,
    lastModified: new Date(),
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/auth/sign-in`,
    lastModified: new Date(),
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/count-kahim`,
    lastModified: new Date(),
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/count-senator`,
    lastModified: new Date(),
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/online-verification`,
    lastModified: new Date(),
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/vote`,
    lastModified: new Date(),
    priority: 0.8,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return urls;
}
