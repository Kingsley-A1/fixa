import {NextRequest} from "next/server";
import {db} from "@/lib/db";
import {currentUser} from "@/lib/auth";
import {readPrivateImage} from "@/lib/private-media";
export const runtime="nodejs";
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(process.env.ENABLE_PORTFOLIO!=="true")return new Response(null,{status:404});
 const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return new Response(null,{status:404});
 const image=await db.workImage.findUnique({where:{id},include:{sample:{select:{status:true,businessId:true,profile:{select:{status:true,ownerUserId:true}}}}}});
 if(!image)return new Response(null,{status:404});
 const publicOk=image.sample.status==="APPROVED"&&image.sample.profile.status==="APPROVED"&&process.env.ENABLE_DISCOVERY==="true";
 if(!publicOk){
  const user=await currentUser();if(!user)return new Response(null,{status:404});
  const admin=await db.platformAdmin.findUnique({where:{userId:user.id}});
  if(!admin&&!(image.sample.profile.ownerUserId===user.id&&user.memberships.some(m=>m.business.id===image.sample.businessId)))return new Response(null,{status:404});
 }
 try{
  const remote=await readPrivateImage(image.blobUrl);
  return new Response(remote.body,{status:200,headers:{"content-type":image.contentType,"cache-control":"private, no-store","x-content-type-options":"nosniff","content-security-policy":"default-src 'none'; sandbox"}});
 }catch{return new Response(null,{status:502});}
}
