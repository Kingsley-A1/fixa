import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://fixa.bespoketech.com.ng",
    changeFrequency: "monthly",
    priority: 1,
  }];
}
