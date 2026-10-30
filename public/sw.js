/* Fixa offline navigation fallback. Never cache private repair, session or customer data. */
const CACHE="fixa-offline-v1";
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.add("/offline");
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith("fixa-offline-")&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.mode!=="navigate"||request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  try{return await fetch(request);}
  catch{
   return (await caches.open(CACHE)).match("/offline") || Response.error();
  }
 })());
});
