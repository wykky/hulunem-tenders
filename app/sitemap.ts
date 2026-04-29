import { getTenders } from "@/lib/data";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE = "https://tenders.hulunem.com";

function safeDate(s: string, fallback: Date): Date {
  if (!s) return fallback;
  const d = new Date(s);
  return isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenders = await getTenders();
  const now = new Date();

  return [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1.0, lastModified: now },
    ...tenders.map((t) => ({
      url: `${BASE}/tenders/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      lastModified: safeDate(t.invitation_date, now),
    })),
  ];
}
