import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, jwtVerify, SignJWT, jwtVerify as verifyState } from "jose";

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
export const GOOGLE_FLOW_COOKIE = "fixa_google_flow";
export function googleConfigured() {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32);
}
function secret() { return new TextEncoder().encode(process.env.AUTH_SECRET!); }
export function callbackUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base || !/^https:\/\//.test(base)) throw new Error("Canonical HTTPS app URL is required");
  return new URL("/api/auth/google/callback", base).toString();
}
export async function beginGoogleFlow(linkUserId?:string){
  if (!googleConfigured()) throw new Error("Google OAuth is not configured");
  const state=randomBytes(24).toString("base64url"),nonce=randomBytes(24).toString("base64url"),verifier=randomBytes(48).toString("base64url");
  const challenge=createHash("sha256").update(verifier).digest("base64url");
  const flow=await new SignJWT({state,nonce,verifier,linkUserId:linkUserId||null})
    .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("10m").sign(secret());
  const u=new URL("https://accounts.google.com/o/oauth2/v2/auth");
  for(const [key,value] of Object.entries({response_type:"code",client_id:process.env.GOOGLE_CLIENT_ID!,redirect_uri:callbackUrl(),scope:"openid email profile",state,nonce,code_challenge:challenge,code_challenge_method:"S256",prompt:"select_account"})) u.searchParams.set(key,value);
  return {url:u.toString(),flow};
}
export async function finishGoogleFlow(cookie:string,state:string,code:string){
  if(!googleConfigured()||!cookie||!state||!code||code.length>2048)throw new Error("OAuth flow invalid");
  const {payload}=await verifyState(cookie,secret(),{algorithms:["HS256"]});
  if(typeof payload.state!=="string" || payload.state!==state || typeof payload.verifier!=="string" || typeof payload.nonce!=="string")throw new Error("OAuth state invalid");
  const data=new URLSearchParams({client_id:process.env.GOOGLE_CLIENT_ID!,client_secret:process.env.GOOGLE_CLIENT_SECRET!,code,code_verifier:payload.verifier,grant_type:"authorization_code",redirect_uri:callbackUrl()});
  const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:data,cache:"no-store",signal:AbortSignal.timeout(9000)});
  if(!response.ok)throw new Error("Google token exchange failed");
  const token=(await response.json()) as {id_token?:string};
  if(!token.id_token)throw new Error("ID token missing");
  const JWKS=createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
  const verified=await jwtVerify(token.id_token,JWKS,{audience:process.env.GOOGLE_CLIENT_ID!,issuer:GOOGLE_ISSUERS,algorithms:["RS256"]});
  const p=verified.payload;
  if(p.nonce!==payload.nonce||p.email_verified!==true||typeof p.email!=="string"||typeof p.sub!=="string"||typeof p.name!=="string")throw new Error("Google identity could not be validated");
  if(!p.email.includes("@")||p.email.length>200||p.sub.length>200)throw new Error("Invalid Google identity");
  return {email:p.email.toLowerCase(),subject:p.sub,name:p.name.slice(0,120),linkUserId:typeof payload.linkUserId==="string"?payload.linkUserId:null};
}
