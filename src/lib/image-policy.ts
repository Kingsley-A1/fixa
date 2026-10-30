/** Reject embedded metadata and animated WebP; photos are re-encoded in the browser first. */
export function cleanWebpBytes(bytes:Uint8Array):boolean{
 if(bytes.length<24||bytes.length>2_000_000)return false;
 const b=Buffer.from(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 if(b.toString("ascii",0,4)!=="RIFF"||b.toString("ascii",8,12)!=="WEBP")return false;
 if(b.readUInt32LE(4)!==b.length-8)return false;
 let p=12,foundPixelData=false;
 while(p+8<=b.length){
  const id=b.toString("ascii",p,p+4),len=b.readUInt32LE(p+4);
  if(len>b.length-p-8)return false;
  if(["EXIF","XMP ","ICCP","ANIM","ANMF"].includes(id))return false;
  if(id==="VP8 "||id==="VP8L")foundPixelData=true;
  p+=8+len+(len%2);
 }
 return p===b.length&&foundPixelData;
}
