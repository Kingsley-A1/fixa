import "server-only";
import {createHash,randomBytes} from "node:crypto";
import {db} from "@/lib/db";
import {sendFixaEmail,emailConfigured} from "@/lib/transactional-email";
export const hashEmailToken=(raw:string)=>createHash("sha256").update(raw).digest("hex");
export async function sendAccountVerification(user:{id:string;email:string;name:string}){
 if(!emailConfigured())return false;
 const last=await db.emailChallenge.findFirst({where:{userId:user.id,createdAt:{gt:new Date(Date.now()-60000)}},orderBy:{createdAt:"desc"}});
 if(last)return false;
 const raw=randomBytes(32).toString("base64url");
 const item=await db.emailChallenge.create({data:{userId:user.id,tokenHash:hashEmailToken(raw),expiresAt:new Date(Date.now()+20*60_000)}});
 const ok=await sendFixaEmail({to:user.email,name:user.name,event:"verification",actionUrl:"https://fixa.bespoketech.com.ng/verify-email/"+raw});
 if(!ok){await db.emailChallenge.delete({where:{id:item.id}});return false;}
 return true;
}
