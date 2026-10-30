import {NextRequest,NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";
import {beginGoogleFlow,GOOGLE_FLOW_COOKIE,googleConfigured} from "@/lib/google-oauth";
export async function GET(request:NextRequest){
 const mode=request.nextUrl.searchParams.get("mode")==="link"?"link":"login";
 if(!googleConfigured())return NextResponse.redirect(new URL("/login?auth=unavailable",request.url));
 const user=mode==="link"?await currentUser():null;
 if(mode==="link"&&!user)return NextResponse.redirect(new URL("/login?auth=sign-in-first",request.url));
 try{
  const {url,flow}=await beginGoogleFlow(user?.id);
  const response=NextResponse.redirect(url);
  response.cookies.set(GOOGLE_FLOW_COOKIE,flow,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/api/auth/google",maxAge:600});
  return response;
 }catch{return NextResponse.redirect(new URL("/login?auth=unavailable",request.url));}
}
