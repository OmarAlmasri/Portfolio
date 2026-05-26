import type { MetadataRoute } from "next";
import { toAbsoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: toAbsoluteSiteUrl("/sitemap.xml"),
    rules: {
      userAgent: "*",
      allow: "/"
    }
  };
}
