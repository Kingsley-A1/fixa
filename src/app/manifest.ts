import type {MetadataRoute} from "next";

/** Public Fixa installation identity. The app launches into the existing workspace. */
export default function manifest():MetadataRoute.Manifest{
 return {
  id:"https://fixa.bespoketech.com.ng/",
  name:"Fixa — Repair Workspace",
  short_name:"Fixa",
  description:"Manage customers, devices and repair jobs in one calm workspace.",
  start_url:"/app",
  scope:"/",
  display:"standalone",
  background_color:"#fcfdf9",
  theme_color:"#203e32",
  orientation:"any",
  lang:"en-NG",
  icons:[
   {src:"/pwa-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
   {src:"/pwa-512.png",sizes:"512x512",type:"image/png",purpose:"any"},
   {src:"/pwa-maskable-512.png",sizes:"512x512",type:"image/png",purpose:"maskable"}
  ]
 };
}
