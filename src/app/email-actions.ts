"use server";
import {randomBytes,createHash} from "node:crypto";
import {db} from "@/lib/db";import {currentUser} from "@/lib/auth";
import {sendFixaEmail,emailConfigured} from "@/lib/transactional-email";
import {revalidatePath} from "next/cache";
export type EmailState={error?:string;success?:string};
export const hashEmailToken=(raw:string)=>createHash("sha256").update(raw).digest("hex");
export async function requestEmailVerification(_prev:EmailState):Promise<EmailState>{
 const user=await currentUser();
 if(!user)return {error:"Please sign in first."};
 if(user.emailVerifiedAt)return {success:"Your email is already verified."};
 if(!emailConfigured())return {error:"Email verification is being configured. Please try again later."};
 const recent=await db.emailChallenge.findFirst({where:{userId:user.id,createdAt:{gt:new Date(Date.now()-60000)}},orderBy:{createdAt:"desc"}});
 if(recent)return {error:"A verification email was recently requested. Try again in a minute."};
 const token=randomBytes(32).toString("base64url");
 const challenge=await db.emailChallenge.create({data:{userId:user.id,tokenHash:hashEmailToken(token),expiresAt:new Date(Date.now()+20*60_000)}});
 const ok=await sendFixaEmail({to:user.email,name:user.name,event:"verification",actionUrl:"https://fixa.bespoketech.com.ng/verify-email/"+token});
 if(!ok){await db.emailChallenge.delete({where:{id:challenge.id}});return {error:"Could not send verification email. Please retry."};}
 return {success:"Check your inbox for a 20-minute verification link."};
}
export async function confirmEmail(_prev:EmailState,form:FormData):Promise<EmailState>{
 const user=await currentUser();if(!user)return {error:"Sign in before confirming your email."};
 const raw=String(form.get("token")||"");if(raw.length<30||raw.length>100)return {error:"Invalid verification link."};
 const challenge=await db.emailChallenge.findUnique({where:{tokenHash:hashEmailToken(raw)}});
 if(!challenge||challenge.userId!==user.id||challenge.consumedAt||challenge.expiresAt<new Date())return {error:"This link has expired or was already used."};
 const succeeded=await db.$transaction(async tx=>{
  const used=await tx.emailChallenge.updateMany({where:{id:challenge.id,consumedAt:null,expiresAt:{gt:new Date()}},data:{consumedAt:new Date()}});
  if(used.count!==1)return false;
  await tx.user.update({where:{id:user.id},data:{emailVerifiedAt:new Date()}});
  return true;
 });
 if(!succeeded)return {error:"This link has already been used."};
 revalidatePath("/app/profile");return {success:"Your email address is verified."};
}
