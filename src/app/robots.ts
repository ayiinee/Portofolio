import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      ...(process.env.VERCEL_ENV === "preview"
        ? { disallow: "/" }
        : { allow: "/" }),
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
