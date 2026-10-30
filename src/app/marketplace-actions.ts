"use server";

import {db} from "@/lib/db";
import {currentUser,requireWorkspace} from "@/lib/auth";
import {randomBytes} from "node:crypto";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export type ActionResult={error?:string;success?:string};
const field=(f:FormData,n:string)=>String(f.get(n)||"").trim();
function fail(message:string):ActionResult{return {error:message};}
const text=z.string().trim();
const profileSchema=z.object({
 displayName:text.min(2).max(100),
 headline:text.max(110),
 bio:text.max(650),
 publicPhone:text.regex(/^\+?[\d\s()-]{7,24}$/,"Enter a valid contact number").max(25),
 state:text.min(2).max(70),
 city:text.min(2).max(70),
 area:text.max(100),
 specialties:z.array(text.min(2).max(60)).min(1).max(10),
 deviceClasses:z.array(text.min(2).max(50)).min(1).max(10)
});
const slug=()=>randomBytes(5).toString("hex");
function csv(value:string){return [...new Set(value.split(",").map(x=>x.trim()).filter(Boolean))];}

export async function saveTechnicianProfile(_prev:ActionResult,fd:FormData):Promise<ActionResult>{
 const {business,user}=await requireWorkspace();
 const data=profileSchema.safeParse({
  displayName:field(fd,"displayName"),headline:field(fd,"headline"),bio:field(fd,"bio"),
  publicPhone:field(fd,"publicPhone"),state:field(fd,"state"),city:field(fd,"city"),area:field(fd,"area"),
  specialties:csv(field(fd,"specialties")),deviceClasses:csv(field(fd,"deviceClasses"))
 });
 if(!data.success)return fail("Add your name, contact, city, state, at least one specialty and device category.");
 const searchText=[data.data.displayName,data.data.headline,data.data.bio,data.data.city,data.data.state,data.data.area,...data.data.specialties,...data.data.deviceClasses].join(" ").toLocaleLowerCase("en");
 const existing=await db.technicianProfile.findUnique({where:{businessId_ownerUserId:{businessId:business.id,ownerUserId:user.id}}});
 try{
   if(existing){
     if(existing.status==="SUSPENDED")return fail("This profile is suspended. Contact Fixa support.");
     await db.technicianProfile.update({where:{id:existing.id},data:{...data.data,searchText,status:"DRAFT",approvedAt:null,contactVerifiedAt:null,locationVerifiedAt:null,ownershipVerifiedAt:null}});
   }else{
     await db.technicianProfile.create({data:{...data.data,searchText,businessId:business.id,ownerUserId:user.id,slug:"tech-"+slug(),status:"DRAFT"}});
   }
 }catch{return fail("Unable to save your profile. Please retry.");}
 revalidatePath("/app/profile");
 return {success:"Profile saved privately. Submit for review when ready."};
}
export async function submitTechnicianProfile(fd:FormData){
 const {business,user}=await requireWorkspace();
 const id=field(fd,"profileId");
 const p=await db.technicianProfile.findFirst({where:{id,businessId:business.id,ownerUserId:user.id}});
 if(!p||!["DRAFT","REJECTED"].includes(p.status))return;
 await db.technicianProfile.update({where:{id:p.id},data:{status:"PENDING"}});
 revalidatePath("/app/profile");
}
export async function assignTechnicianToJob(fd:FormData){
 const {business,role}=await requireWorkspace();
 if(!["OWNER","ADMIN"].includes(role))return;
 const jobId=field(fd,"jobId"),profileId=field(fd,"profileId");
 const profile=await db.technicianProfile.findFirst({where:{id:profileId,businessId:business.id}});
 if(!profile)return;
 // Never reassign an already-collected service to another technician for review attribution.
 await db.repairJob.updateMany({where:{id:jobId,businessId:business.id,status:{in:["RECEIVED","DIAGNOSING","AWAITING_APPROVAL","IN_PROGRESS"]}},data:{assignedProfileId:profile.id}});
 revalidatePath("/app/jobs/"+jobId);
}
export async function issueReviewInvitation(fd:FormData){
 if(process.env.ENABLE_DISCOVERY!=="true")return;
 const {business,role}=await requireWorkspace();
 if(!["OWNER","ADMIN"].includes(role))return;
 const id=field(fd,"jobId");
 const job=await db.repairJob.findFirst({where:{id,businessId:business.id},include:{assignedProfile:true,reviewInvitation:true,review:true}});
 if(!job||job.status!=="COLLECTED"||!job.assignedProfile||job.assignedProfile.status!=="APPROVED"||job.review)return;
 if(job.reviewInvitation)return;
 try{await db.reviewInvitation.create({data:{jobId:job.id,profileId:job.assignedProfile.id,expiresAt:new Date(Date.now()+30*86400_000)}});}catch{return;}
 revalidatePath("/app/jobs/"+job.id);
}
const reviewSchema=z.object({rating:z.coerce.number().int().min(1).max(5),comment:text.min(15).max(1500)});
export async function submitServiceReview(_prev:ActionResult,fd:FormData):Promise<ActionResult>{
 if(process.env.ENABLE_DISCOVERY!=="true")return fail("Reviews are not open yet.");
 const token=field(fd,"token"),data=reviewSchema.safeParse({rating:field(fd,"rating"),comment:field(fd,"comment")});
 if(!/^[0-9a-f-]{36}$/i.test(token)||!data.success)return fail("Provide a rating and at least 15 characters of genuine feedback.");
 try{
  await db.$transaction(async tx=>{
   const invitation=await tx.reviewInvitation.findUnique({where:{token},include:{job:true,profile:true}});
   if(!invitation||invitation.usedAt||invitation.expiresAt<new Date()||invitation.job.status!=="COLLECTED"||invitation.profile.status!=="APPROVED")throw new Error("invalid-review-invitation");
   if(invitation.job.assignedProfileId!==invitation.profileId)throw new Error("review-attribution-changed");
   const consumed=await tx.reviewInvitation.updateMany({where:{id:invitation.id,usedAt:null},data:{usedAt:new Date()}});
   if(consumed.count!==1)throw new Error("invitation-used");
   await tx.technicianReview.create({data:{jobId:invitation.jobId,profileId:invitation.profileId,rating:data.data.rating,comment:data.data.comment,status:"PENDING"}});
  });
 }catch{return fail("This invitation is invalid, expired or has already been used.");}
 return {success:"Thank you. Your review has been submitted for moderation."};
}
async function platformAdmin(){
 const user=await currentUser();if(!user)redirect("/login");
 const granted=await db.platformAdmin.findUnique({where:{userId:user.id}});
 if(!granted)redirect("/app");
 return user;
}
export async function requirePlatformAdmin(){return platformAdmin();}
export async function moderateProfile(fd:FormData){
 const user=await platformAdmin();
 const id=field(fd,"id"),decision=field(fd,"decision"),reason=field(fd,"reason");
 if(!["APPROVE","REJECT","SUSPEND"].includes(decision)||reason.length<8||reason.length>600)return;
 const profile=await db.technicianProfile.findUnique({where:{id}});if(!profile)return;
 if(decision==="APPROVE"&&profile.status!=="PENDING")return;
 if(decision==="APPROVE"&&(field(fd,"contactChecked")!=="on"||field(fd,"locationChecked")!=="on"||field(fd,"ownershipChecked")!=="on"))return;
 const next=decision==="APPROVE"?"APPROVED":decision==="REJECT"?"REJECTED":"SUSPENDED";
 await db.$transaction(async tx=>{
  await tx.technicianProfile.update({where:{id},data:{status:next,approvedAt:decision==="APPROVE"?new Date():null,contactVerifiedAt:decision==="APPROVE"?new Date():profile.contactVerifiedAt,locationVerifiedAt:decision==="APPROVE"?new Date():profile.locationVerifiedAt,ownershipVerifiedAt:decision==="APPROVE"?new Date():profile.ownershipVerifiedAt}});
  await tx.moderationAction.create({data:{actorUserId:user.id,targetType:"TechnicianProfile",targetId:id,decision,reason}});
 });
 revalidatePath("/app/admin");revalidatePath("/find");
}
export async function moderateReview(fd:FormData){
 const user=await platformAdmin();
 const id=field(fd,"id"),decision=field(fd,"decision"),reason=field(fd,"reason");
 if(!["PUBLISH","REJECT"].includes(decision)||reason.length<8||reason.length>600)return;
 const review=await db.technicianReview.findUnique({where:{id},include:{profile:true}});if(!review||review.status!=="PENDING")return;
 await db.$transaction(async tx=>{
  await tx.technicianReview.update({where:{id},data:{status:decision==="PUBLISH"?"PUBLISHED":"REJECTED",publishedAt:decision==="PUBLISH"?new Date():null}});
  await tx.moderationAction.create({data:{actorUserId:user.id,targetType:"TechnicianReview",targetId:id,decision,reason}});
 });
 revalidatePath("/app/admin");revalidatePath("/technicians/"+review.profile.slug);
}
