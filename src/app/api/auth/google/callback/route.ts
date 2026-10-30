import {NextRequest,NextResponse} from "next/server";
import {db} from "@/lib/db";
import {currentUser,setSession} from "@/lib/auth";
import {finishGoogleFlow,GOOGLE_FLOW_COOKIE} from "@/lib/google-oauth";
function back(request:NextRequest,code:string){
 const url=new URL("/login",request.url);url.searchParams.set("auth",code);return NextResponse.redirect(url);
}
export async function GET(request:NextRequest){
 const state=request.nextUrl.searchParams.get("state"),code=request.nextUrl.searchParams.get("code"),cookie=request.cookies.get(GOOGLE_FLOW_COOKIE)?.value;
 if(request.nextUrl.searchParams.has("error")||!state||!code||!cookie){const r=back(request,"cancelled");r.cookies.set(GOOGLE_FLOW_COOKIE,"",{path:"/api/auth/google",maxAge:0});return r;}
 try{
  const identity=await finishGoogleFlow(cookie,state,code);
  let user=await db.user.findUnique({where:{googleSubject:identity.subject}});
  if(identity.linkUserId){
   const signedIn=await currentUser();
   if(!signedIn||signedIn.id!==identity.linkUserId)throw Error("link session expired");
   if(user&&user.id!==signedIn.id){const r=back(request,"already-linked");r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;}
   const existing=await db.user.findUnique({where:{id:signedIn.id}});
   if(!existing||existing.googleSubject&&existing.googleSubject!==identity.subject)throw Error("account already linked");
   if(existing.email.toLowerCase()!==identity.email)throw Error("Google address does not match Fixa email");
   await db.user.update({where:{id:signedIn.id},data:{googleSubject:identity.subject,emailVerifiedAt:existing.emailVerifiedAt||new Date()}});
   const r=NextResponse.redirect(new URL("/app/profile?google=linked",request.url));r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;
  }
  if(!user){
    const emailUser=await db.user.findUnique({where:{email:identity.email}});
    if(emailUser){const r=back(request,"link-required");r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;}
    if(process.env.ENABLE_REGISTRATION!=="true"){const r=back(request,"registration-closed");r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;}
    user=await db.user.create({data:{name:identity.name,email:identity.email,passwordHash:null,googleSubject:identity.subject,emailVerifiedAt:new Date()}});
  }
  await setSession(user.id);
  const r=NextResponse.redirect(new URL("/app",request.url));r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;
 }catch(error){
  console.error("[fixa] Google OAuth failed",error instanceof Error?error.name:"Unknown");
  const r=back(request,"failed");r.cookies.delete(GOOGLE_FLOW_COOKIE);return r;
 }
}
