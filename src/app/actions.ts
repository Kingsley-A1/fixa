"use server";
import { db } from "@/lib/db";
import { currentUser, requireWorkspace, setSession, clearSession } from "@/lib/auth";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { JobStatus } from "@prisma/client";

type FormState = { error?: string; success?: string };
const emailSchema=z.email().max(200);
function val(fd:FormData,key:string){return String(fd.get(key)||"").trim();}
function code(prefix:string){return prefix+"-"+randomBytes(5).toString("hex").toUpperCase();}
function fail(msg:string):FormState{return {error:msg};}
const customerSchema=z.object({name:z.string().min(2).max(120),phone:z.string().min(7).max(25),whatsapp:z.string().max(25),email:z.union([emailSchema,z.literal("")])});
const deviceSchema=z.object({customerId:z.uuid(),brand:z.string().min(2).max(80),model:z.string().min(1).max(120),category:z.string().max(50),serialNumber:z.string().max(120),imei:z.string().max(40),color:z.string().max(80),notes:z.string().max(500)});
const jobSchema=z.object({customerId:z.uuid(),deviceId:z.uuid(),issue:z.string().min(5).max(1000),condition:z.string().max(1000),accessories:z.string().max(500),estimatedPrice:z.string(),deposit:z.string(),dueDate:z.string()});
function amount(v:string){if(!v)return null;const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=1000000000? n:NaN;}

export async function register(_prev:FormState,fd:FormData):Promise<FormState>{
 const parsed=z.object({name:z.string().min(2).max(120),email:emailSchema,password:z.string().min(12).max(100)}).safeParse({name:val(fd,"name"),email:val(fd,"email").toLowerCase(),password:val(fd,"password")});
 if(!parsed.success)return fail("Enter your name, a valid email and a password of at least 12 characters.");
 const {name,email,password}=parsed.data;
 try{const user=await db.user.create({data:{name,email,passwordHash:await hash(password,12)}});await setSession(user.id);}catch{return fail("Unable to create account. This email may already be registered.");}
 redirect("/setup");
}
export async function login(_prev:FormState,fd:FormData):Promise<FormState>{
 const email=val(fd,"email").toLowerCase(),password=val(fd,"password");
 const user=await db.user.findUnique({where:{email}});
 if(!user||!(await compare(password,user.passwordHash)))return fail("Incorrect email or password.");
 await setSession(user.id);redirect("/app");
}
export async function logout(){await clearSession();redirect("/login");}
export async function createBusiness(_prev:FormState,fd:FormData):Promise<FormState>{
 const user=await currentUser();if(!user)redirect("/login");
 if(user.memberships.length)redirect("/app");
 const name=val(fd,"name");if(name.length<2||name.length>120)return fail("Enter a valid business name.");
 try{await db.$transaction(async tx=>{const business=await tx.business.create({data:{name,slug:code("shop").toLowerCase(),phone:val(fd,"phone")||null}});await tx.membership.create({data:{userId:user.id,businessId:business.id,role:"OWNER"}});});}catch{return fail("Couldn't create workspace. Please retry.");}
 redirect("/app");
}
export async function createCustomer(_prev:FormState,fd:FormData):Promise<FormState>{
 const {business}=await requireWorkspace();
 const parsed=customerSchema.safeParse(Object.fromEntries(["name","phone","whatsapp","email"].map(k=>[k,val(fd,k)])));
 if(!parsed.success)return fail("Please enter a customer name and valid phone number.");
 await db.customer.create({data:{...parsed.data,whatsapp:parsed.data.whatsapp||null,email:parsed.data.email||null,businessId:business.id}});
 revalidatePath("/app");revalidatePath("/app/customers");redirect("/app/customers");
}
export async function createDevice(_prev:FormState,fd:FormData):Promise<FormState>{
 const {business}=await requireWorkspace();
 const parsed=deviceSchema.safeParse(Object.fromEntries(["customerId","brand","model","category","serialNumber","imei","color","notes"].map(k=>[k,val(fd,k)])));
 if(!parsed.success)return fail("Enter a customer, device brand and model.");
 const d=parsed.data;
 const customer=await db.customer.findFirst({where:{id:d.customerId,businessId:business.id}});if(!customer)return fail("Customer does not belong to your workspace.");
 await db.device.create({data:{...d,code:code("DEV"),businessId:business.id,serialNumber:d.serialNumber||null,imei:d.imei||null,color:d.color||null,notes:d.notes||null}});
 revalidatePath("/app");revalidatePath("/app/devices");redirect("/app/devices");
}
export async function createJob(_prev:FormState,fd:FormData):Promise<FormState>{
 const {business,user}=await requireWorkspace();
 const parsed=jobSchema.safeParse(Object.fromEntries(["customerId","deviceId","issue","condition","accessories","estimatedPrice","deposit","dueDate"].map(k=>[k,val(fd,k)])));
 if(!parsed.success)return fail("Select a customer and device and describe the issue.");
 const d=parsed.data;const estimatedPrice=amount(d.estimatedPrice),deposit=amount(d.deposit);
 if(Number.isNaN(estimatedPrice)||Number.isNaN(deposit))return fail("Enter valid non-negative amounts.");
 if(estimatedPrice!==null&&deposit!==null&&deposit>estimatedPrice)return fail("Deposit cannot exceed the estimated amount.");
 const device=await db.device.findFirst({where:{id:d.deviceId,businessId:business.id,customerId:d.customerId}});
 if(!device)return fail("The selected device does not belong to this customer.");
 let dueDate:Date|null=null;
 if(d.dueDate){dueDate=new Date(d.dueDate+"T12:00:00Z");if(Number.isNaN(dueDate.getTime()))return fail("Invalid expected completion date.");}
 const job=await db.repairJob.create({data:{businessId:business.id,customerId:d.customerId,deviceId:d.deviceId,code:code("JOB"),issue:d.issue,condition:d.condition||null,accessories:d.accessories||null,estimatedPrice,deposit,dueDate,events:{create:{toStatus:"RECEIVED",changedById:user.id}}}});
 revalidatePath("/app");redirect("/app/jobs/"+job.id);
}
export async function updateStatus(fd:FormData){
 const {business,user}=await requireWorkspace();
 const id=val(fd,"id"),status=val(fd,"status");
 if(!Object.values(JobStatus).includes(status as JobStatus))return;
 const existing=await db.repairJob.findFirst({where:{id,businessId:business.id}});
 if(!existing)return;
 if(existing.status===status)return;
 if(existing.status==="COLLECTED"||existing.status==="CANCELLED")return;
 await db.$transaction(async tx=>{await tx.repairJob.update({where:{id},data:{status:status as JobStatus,completedAt:status==="READY"?new Date():existing.completedAt,collectedAt:status==="COLLECTED"?new Date():existing.collectedAt}});await tx.jobEvent.create({data:{jobId:id,changedById:user.id,fromStatus:existing.status,toStatus:status as JobStatus}})});
 revalidatePath("/app");revalidatePath("/app/jobs/"+id);
}
