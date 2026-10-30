"use server";
import {db} from "@/lib/db";import {currentUser} from "@/lib/auth";
import {emailConfigured} from "@/lib/transactional-email";
import {hashEmailToken,sendAccountVerification} from "@/lib/email-challenges";
import {revalidatePath} from "next/cache";
export type EmailState={error?:string;success?:string};
export async function requestEmailVerification(_prev:EmailState):Promise<EmailState>{
 const user=await currentUser();
 if(!user)return {error:"Please sign in first."};
 if(user.emailVerifiedAt)return {success:"Your email is already verified."};
 if(!emailConfigured())return {error:"Email verification is being configured. Please try again later."};
 const ok=await sendAccountVerification(user);
 if(!ok)return {error:"Unable to send another verification email right now. Please try later."};
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
