import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evoluth.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: base,
      lastModified: new Date("2026-11-10"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/privacidad`,
      lastModified: new Date("2026-11-10"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
