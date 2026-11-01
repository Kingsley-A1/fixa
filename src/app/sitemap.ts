import type {MetadataRoute} from "next";
const origin="https://fixa.bespoketech.com.ng";
export default function sitemap():MetadataRoute.Sitemap{
 return [
  {url:origin,changeFrequency:"monthly",priority:1},
  {url:origin+"/for-technicians",changeFrequency:"monthly",priority:0.7},
  {url:origin+"/about",changeFrequency:"monthly",priority:0.6},
  {url:origin+"/faq",changeFrequency:"monthly",priority:0.6},
  {url:origin+"/terms",changeFrequency:"yearly",priority:0.3},
  {url:origin+"/privacy",changeFrequency:"yearly",priority:0.3},
  {url:origin+"/support",changeFrequency:"monthly",priority:0.5},
 ];
}
