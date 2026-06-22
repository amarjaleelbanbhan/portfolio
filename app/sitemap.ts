import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Real routes of CODEX INFINITUM: the universe root (the whole experience lives
 * at `/`) and the preserved v1 Legacy Archive under `/legacy/*`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/legacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/legacy/projects`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legacy/skills`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legacy/certifications`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legacy/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
