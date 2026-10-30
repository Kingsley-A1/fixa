"use server";
import {db} from "@/lib/db";
import {requireWorkspace,currentUser} from "@/lib/auth";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {deletePrivateImage} from "@/lib/private-media";
const get=(form:FormData,name:string)=>String(form.get(name)||"").trim();
type Result={error?:string;success?:string};
const sampleSchema=z.object({title:z.string().trim().min(4).max(95),description:z.string().trim().max(350)});
export async function createWorkSample(_prev:Result,form:FormData):Promise<Result>{
 const {business,user}=await requireWorkspace();
 const jobId=get(form,"jobId");const p=sampleSchema.safeParse({title:get(form,"title"),description:get(form,"description")});
 if(!p.success)return {error:"Add a short title and optional note."};
 const job=await db.repairJob.findFirst({where:{id:jobId,businessId:business.id,status:{in:["READY","COLLECTED"]}},include:{assignedProfile:true,workSample:true}});
 if(!job||!job.assignedProfile||job.assignedProfile.ownerUserId!==user.id)return {error:"You can only add completed work assigned to your technician profile."};
 if(job.workSample)return {error:"A work sample is already linked to this repair."};
 await db.workSample.create({data:{businessId:business.id,profileId:job.assignedProfile.id,jobId,title:p.data.title,description:p.data.description||null,status:"DRAFT"}});
 revalidatePath("/app/profile");return {success:"Work saved as a private draft. Add up to three photos."};
}
export async function saveWorkDetails(_prev:Result,form:FormData):Promise<Result>{
 const {business,user}=await requireWorkspace();const id=get(form,"id");
 const p=sampleSchema.safeParse({title:get(form,"title"),description:get(form,"description")});
 if(!p.success)return {error:"Add a short title of up to 95 characters."};
 const sample=await db.workSample.findFirst({where:{id,businessId:business.id,profile:{ownerUserId:user.id},status:{in:["DRAFT","REJECTED"]}}});
 if(!sample)return {error:"This draft cannot be edited."};
 await db.workSample.update({where:{id},data:{...p.data,status:"DRAFT",publishedAt:null}});
 revalidatePath("/app/profile");return {success:"Draft saved."};
}
export async function submitWorkSample(form:FormData){
 const {business,user}=await requireWorkspace();const id=get(form,"id");
 if(get(form,"permission")!=="yes")return;
 const sample=await db.workSample.findFirst({where:{id,businessId:business.id,profile:{ownerUserId:user.id},status:{in:["DRAFT","REJECTED"]}},include:{images:true,job:true}});
 if(!sample||sample.images.length<1||sample.images.length>3||!["READY","COLLECTED"].includes(sample.job.status))return;
 await db.workSample.update({where:{id:sample.id},data:{status:"PENDING",customerConsentAt:new Date(),submittedAt:new Date()}});
 revalidatePath("/app/profile");
}
export async function moderateWorkSample(form:FormData){
 const user=await currentUser();if(!user)return;
 const admin=await db.platformAdmin.findUnique({where:{userId:user.id}});if(!admin)return;
 const id=get(form,"id"),decision=get(form,"decision"),reason=get(form,"reason");
 if(!["APPROVE","REJECT"].includes(decision)||reason.length<8||reason.length>600)return;
 const sample=await db.workSample.findUnique({where:{id},include:{images:true,profile:true}});
 if(!sample||sample.status!=="PENDING"||sample.images.length===0||!sample.customerConsentAt||sample.profile.status!=="APPROVED")return;
 await db.$transaction(async tx=>{
   await tx.workSample.update({where:{id},data:{status:decision==="APPROVE"?"APPROVED":"REJECTED",publishedAt:decision==="APPROVE"?new Date():null}});
   await tx.moderationAction.create({data:{actorUserId:user.id,targetType:"WorkSample",targetId:id,decision,reason}});
 });
 revalidatePath("/app/admin");revalidatePath("/technicians/"+sample.profile.slug);
}

export async function removeWorkImage(form:FormData){
 const {business,user}=await requireWorkspace();
 const id=get(form,"id");
 const image=await db.workImage.findUnique({where:{id},include:{sample:{include:{profile:true}}}});
 if(!image||image.sample.businessId!==business.id||image.sample.profile.ownerUserId!==user.id||!["DRAFT","REJECTED"].includes(image.sample.status))return;
 // Remove database reference first; unused private blobs can be reconciled by maintenance if deletion fails.
 await db.workImage.delete({where:{id}});
 await deletePrivateImage(image.blobUrl).catch(()=>console.error("[fixa] private media cleanup required"));
 revalidatePath("/app/profile");
}

export async function unpublishWorkSample(form:FormData){
 const {business,user}=await requireWorkspace();
 const id=get(form,"id");
 const item=await db.workSample.findFirst({where:{id,businessId:business.id,profile:{ownerUserId:user.id},status:"APPROVED"}});
 if(!item)return;
 await db.workSample.update({where:{id},data:{status:"DRAFT",publishedAt:null,customerConsentAt:null,submittedAt:null}});
 revalidatePath("/app/profile");
 const profile=await db.technicianProfile.findUnique({where:{id:item.profileId},select:{slug:true}});
 if(profile)revalidatePath("/technicians/"+profile.slug);
}
