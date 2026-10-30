import "server-only";
import {randomUUID} from "node:crypto";
const API="https://vercel.com/api/blob/";
function auth(){
 const token=process.env.BLOB_READ_WRITE_TOKEN;
 if(!token||!token.startsWith("vercel_blob_rw_"))throw new Error("Private Blob is not configured");
 const store=token.split("_")[3];
 if(!store)throw new Error("Blob store missing");
 return {token,store};
}
export function supportedPrivateImage(url:string){
 try{const u=new URL(url);const store=auth().store;return u.protocol==="https:"&&u.hostname===store+".private.blob.vercel-storage.com"&&u.pathname.startsWith("/fixa-work/")&&!u.username&&!u.password;}catch{return false;}
}
export async function uploadPrivateImage(content:Buffer,mime:"image/webp"|"image/jpeg"|"image/png"){
 const {token,store}=auth();const ext=mime==="image/webp"?"webp":mime==="image/png"?"png":"jpg";
 const pathname="fixa-work/"+randomUUID()+"."+ext;
 const res=await fetch(API+"?pathname="+encodeURIComponent(pathname),{
 method:"PUT",headers:{Authorization:"Bearer "+token,"x-vercel-blob-store-id":store,"x-api-version":"12","x-vercel-blob-access":"private","x-add-random-suffix":"0","x-content-type":mime,"content-type":mime},body:new Uint8Array(content),signal:AbortSignal.timeout(16000)});
 if(!res.ok)throw new Error("Private media upload failed");
 const data=(await res.json()) as {url:string};
 if(!supportedPrivateImage(data.url))throw new Error("Unexpected media location");
 return data.url;
}
export async function readPrivateImage(url:string){
 if(!supportedPrivateImage(url))throw new Error("Media URL invalid");
 const res=await fetch(url,{headers:{Authorization:"Bearer "+auth().token},cache:"no-store",signal:AbortSignal.timeout(8000)});
 if(!res.ok)throw new Error("Media retrieval failed");
 return res;
}
