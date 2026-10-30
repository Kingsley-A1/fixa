"use server";
import { db } from "@/lib/db";
import {
  currentUser,
  requireWorkspace,
  setSession,
  clearSession,
} from "@/lib/auth";
import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { JobStatus } from "@prisma/client";
import {mayTransition} from "@/lib/job-workflow";
import { registrationEnabled, workspaceConfigured } from "@/lib/config";

type FormState = { error?: string; success?: string };
const emailSchema = z.email().max(200);
function val(fd: FormData, key: string) {
  return String(fd.get(key) || "").trim();
}
function code(prefix: string) {
  return prefix + "-" + randomBytes(5).toString("hex").toUpperCase();
}
function fail(msg: string): FormState {
  return { error: msg };
}
function errorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error)
    return String((error as { code?: unknown }).code);
  return "";
}
function log(context: string, error: unknown) {
  console.error(`[fixa] ${context} failed:`, error);
}
/** Turns a caught error into a message a user can act on. */
function explain(error: unknown, fallback: string) {
  const code = errorCode(error);
  if (code === "P1001" || code === "P1002" || code === "P1017")
    return "Cannot reach the database right now. Check DATABASE_URL and try again.";
  if (code === "P2021" || code === "P2022")
    return "The database schema is out of date. Run `prisma migrate deploy`, then retry.";
  if (process.env.NODE_ENV === "production") return fallback;
  const detail = error instanceof Error ? error.message : String(error);
  return detail ? `${fallback} (${code || "no code"}: ${detail})` : fallback;
}
function failure(context: string, error: unknown, fallback: string) {
  log(context, error);
  return explain(error, fallback);
}
/** Reports which submitted fields failed validation and why. */
function invalid(error: z.ZodError) {
  console.warn("[fixa] validation failed:", error.issues);
  return (
    "Check your details — " +
    error.issues
      .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
      .join("; ")
  );
}
const customerSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(25),
  whatsapp: z.string().max(25),
  email: z.union([emailSchema, z.literal("")]),
});
const deviceSchema = z.object({
  customerId: z.uuid(),
  brand: z.string().min(2).max(80),
  model: z.string().min(1).max(120),
  modelNumber: z.string().max(100),
  category: z.string().max(50),
  serialNumber: z.string().max(120),
  imei: z.string().max(40),
  color: z.string().max(80),
  notes: z.string().max(500),
});
const jobSchema = z.object({
  customerId: z.uuid(),
  deviceId: z.uuid(),
  issue: z.string().min(5).max(1000),
  condition: z.string().max(1000),
  accessories: z.string().max(500),
  estimatedPrice: z.string(),
  deposit: z.string(),
  dueDate: z.string(),
  assignedProfileId: z.string(),
});
function amount(v: string) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 1000000000 ? n : NaN;
}

export async function register(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  if (!registrationEnabled())
    return fail(
      "Public registration is not open yet. Please explore the demo.",
    );
  const password = String(fd.get("password") || "");
  const parsed = z
    .object({
      name: z.string().min(2).max(120),
      email: emailSchema,
      password: z
        .string()
        .min(8)
        .refine(
          (value) => Buffer.byteLength(value, "utf8") <= 72,
          "Password is too long",
        ),
    })
    .safeParse({
      name: val(fd, "name"),
      email: val(fd, "email").toLowerCase(),
      password,
    });
  if (!parsed.success) return fail(invalid(parsed.error));
  const { name, email } = parsed.data;
  let user;
  try {
    user = await db.user.create({
      data: { name, email, passwordHash: await hash(password, 12) },
    });
  } catch (error) {
    if (errorCode(error) === "P2002") {
      log("register", error);
      return fail(
        "An account with that email already exists. Sign in instead.",
      );
    }
    return fail(
      failure(
        "register",
        error,
        "Unable to create account. Please try again or sign in.",
      ),
    );
  }
  await setSession(user.id);
  redirect("/setup");
}
export async function login(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  if (!workspaceConfigured())
    return fail(
      "Business sign-in is not connected yet. Please explore the demo.",
    );
  const email = val(fd, "email").toLowerCase(),
    password = String(fd.get("password") || "");
  if (
    !emailSchema.safeParse(email).success ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  )
    return fail("Incorrect email or password.");
  let user;
  try {
    user = await db.user.findUnique({ where: { email } });
  } catch (error) {
    return fail(
      failure(
        "login",
        error,
        "Sign-in is temporarily unavailable. Please try again shortly.",
      ),
    );
  }
  if (!user || !(await compare(password, user.passwordHash)))
    return fail("Incorrect email or password.");
  await setSession(user.id);
  redirect("/app");
}
export async function logout() {
  await clearSession();
  redirect("/login");
}
export async function createBusiness(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.memberships.length) redirect("/app");
  const name = val(fd, "name");
  if (name.length < 2 || name.length > 120)
    return fail("Enter a valid business name.");
  try {
    await db.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name,
          slug: code("shop").toLowerCase(),
          phone: val(fd, "phone") || null,
        },
      });
      await tx.membership.create({
        data: { userId: user.id, businessId: business.id, role: "OWNER" },
      });
    });
  } catch (error) {
    return fail(
      failure(
        "createBusiness",
        error,
        "Couldn't create workspace. Please retry.",
      ),
    );
  }
  redirect("/app");
}
export async function createCustomer(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const { business } = await requireWorkspace();
  const parsed = customerSchema.safeParse(
    Object.fromEntries(
      ["name", "phone", "whatsapp", "email"].map((k) => [k, val(fd, k)]),
    ),
  );
  if (!parsed.success) return fail(invalid(parsed.error));
  await db.customer.create({
    data: {
      ...parsed.data,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      businessId: business.id,
    },
  });
  revalidatePath("/app");
  revalidatePath("/app/customers");
  redirect("/app/customers");
}
export async function createDevice(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const { business } = await requireWorkspace();
  const parsed = deviceSchema.safeParse(
    Object.fromEntries(
      [
        "customerId",
        "brand",
        "model",
        "modelNumber",
        "category",
        "serialNumber",
        "imei",
        "color",
        "notes",
      ].map((k) => [k, val(fd, k)]),
    ),
  );
  if (!parsed.success) return fail(invalid(parsed.error));
  const d = parsed.data;
  const customer = await db.customer.findFirst({
    where: { id: d.customerId, businessId: business.id },
  });
  if (!customer) return fail("Customer does not belong to your workspace.");
  await db.device.create({
    data: {
      ...d,
      code: code("DEV"),
      businessId: business.id,
      modelNumber: d.modelNumber || null,
      serialNumber: d.serialNumber || null,
      imei: d.imei || null,
      color: d.color || null,
      notes: d.notes || null,
    },
  });
  revalidatePath("/app");
  revalidatePath("/app/devices");
  redirect("/app/devices");
}
export async function createJob(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const { business, user } = await requireWorkspace();
  const parsed = jobSchema.safeParse(
    Object.fromEntries(
      [
        "customerId",
        "deviceId",
        "issue",
        "condition",
        "accessories",
        "estimatedPrice",
        "deposit",
        "dueDate",
        "assignedProfileId",
      ].map((k) => [k, val(fd, k)]),
    ),
  );
  if (!parsed.success) return fail(invalid(parsed.error));
  const d = parsed.data;
  const estimatedPrice = amount(d.estimatedPrice),
    deposit = amount(d.deposit);
  if (Number.isNaN(estimatedPrice) || Number.isNaN(deposit))
    return fail("Enter valid non-negative amounts.");
  if (estimatedPrice !== null && deposit !== null && deposit > estimatedPrice)
    return fail("Deposit cannot exceed the estimated amount.");
  const device = await db.device.findFirst({
    where: {
      id: d.deviceId,
      businessId: business.id,
      customerId: d.customerId,
    },
  });
  if (!device)
    return fail("The selected device does not belong to this customer.");
  let dueDate: Date | null = null;
  if (d.dueDate) {
    dueDate = new Date(d.dueDate + "T12:00:00Z");
    if (Number.isNaN(dueDate.getTime()))
      return fail("Invalid expected completion date.");
  }
  let assignedProfileId: string | null = null;
  if(d.assignedProfileId){
    const profile=await db.technicianProfile.findFirst({where:{id:d.assignedProfileId,businessId:business.id}});
    if(!profile)return fail("The selected technician does not belong to this business.");
    assignedProfileId=profile.id;
  }
  const job = await db.repairJob.create({
    data: {
      businessId: business.id,
      customerId: d.customerId,
      deviceId: d.deviceId,
      assignedProfileId,
      code: code("JOB"),
      issue: d.issue,
      condition: d.condition || null,
      accessories: d.accessories || null,
      estimatedPrice,
      deposit,
      dueDate,
      events: { create: { toStatus: "RECEIVED", changedById: user.id } },
    },
  });
  revalidatePath("/app");
  redirect("/app/jobs/" + job.id);
}
export async function updateStatus(_prev:FormState,fd:FormData):Promise<FormState>{
 const {business,user}=await requireWorkspace();
 const id=val(fd,"id"),status=val(fd,"status") as JobStatus;
 if(!Object.values(JobStatus).includes(status))return fail("Choose a valid repair status.");
 const existing=await db.repairJob.findFirst({where:{id,businessId:business.id}});
 if(!existing)return fail("This repair was not found in your workspace.");
 if(existing.status===status)return fail("This repair already has that status.");
 if(!mayTransition(existing.status,status))return fail("Choose the next appropriate repair stage.");
 const collectedByName=val(fd,"collectedByName");
 if(status==="COLLECTED"&&(collectedByName.length<2||collectedByName.length>120||val(fd,"handoverConfirmed")!=="yes")){
   return fail("Record who collected the device and confirm handover verification.");
 }
 const note=status==="COLLECTED"?"Collection confirmed for "+collectedByName:val(fd,"note").slice(0,250)||null;
 try{
  await db.$transaction(async tx=>{
   const changed=await tx.repairJob.updateMany({where:{id,businessId:business.id,status:existing.status},data:{
    status,completedAt:status==="READY"?new Date():existing.completedAt,
    collectedAt:status==="COLLECTED"?new Date():existing.collectedAt,
    collectedByName:status==="COLLECTED"?collectedByName:existing.collectedByName,
    handoverNote:status==="COLLECTED"?val(fd,"note").slice(0,250)||null:existing.handoverNote
   }});
   if(changed.count!==1)throw new Error("conflicting-status-update");
   await tx.jobEvent.create({data:{jobId:id,changedById:user.id,fromStatus:existing.status,toStatus:status,note}});
  });
 }catch(error){
  log("updateStatus",error);
  return fail("Repair status changed elsewhere or could not be saved. Refresh and retry.");
 }
 revalidatePath("/app");revalidatePath("/app/jobs");revalidatePath("/app/jobs/"+id);revalidatePath("/ticket/"+existing.publicToken);
 return {success:"Repair status updated and recorded."};
}
