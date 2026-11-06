import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  // Local production builds have no public origin until configured for deployment.
  if (!origin) return [];
  return [
    "",
    "/projects",
    "/achievements",
    ...projects.map((project) => `/projects/${project.slug}`),
  ].map((path) => ({ url: `${origin}${path}` }));
}
