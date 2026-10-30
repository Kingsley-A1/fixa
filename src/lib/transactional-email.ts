import "server-only";
const HOST="https://api.resend.com/emails";
export function emailConfigured(){return Boolean(process.env.RESEND_API_KEY && process.env.FIXA_EMAIL_FROM);}
export type EmailEvent="verification"|"profile-approved"|"profile-rejected";
function esc(value:string){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));}
export async function sendFixaEmail({to,name,event,actionUrl}:{to:string;name:string;event:EmailEvent;actionUrl?:string}){
 if(!emailConfigured())return false;
 const given=esc(name.split(" ")[0]||"there");
 const subject=event==="verification"?"Verify your email for Fixa":event==="profile-approved"?"Your Fixa profile is approved":"Your Fixa profile needs attention";
 const body=event==="verification"?"Confirm your email address to secure your Fixa account.":event==="profile-approved"?"Your technician profile has been approved for public discovery.":"Your technician profile needs changes before publication. Please open Fixa to review it.";
 const label=event==="verification"?"Verify email":"Open Fixa";
 const safeUrl=actionUrl&&actionUrl.startsWith("https://fixa.bespoketech.com.ng/")?actionUrl:"https://fixa.bespoketech.com.ng/app/profile";
 const plain="Hi "+name.split(" ")[0]+",\n\n"+body+"\n\n"+label+": "+safeUrl+(event==="verification"?"\n\nThis link expires in 20 minutes.":"")+"\n\nfixa.\nA product by Bespoke Technologies.";
 const html=`<!doctype html><html><body style="margin:0;background:#f7f9f5;padding:32px 16px;font-family:Arial,sans-serif;color:#213d32"><main style="max-width:500px;margin:auto;background:#fff;padding:34px;border-radius:14px;border:1px solid #e7ebe5"><p style="font-weight:800;font-size:28px;letter-spacing:-1px;margin:0 0 38px">fixa<span style="color:#85a166">.</span></p><p style="font-size:17px;font-weight:600">Hi ${given},</p><p style="font-size:15px;line-height:1.7;color:#43594d">${esc(body)}</p><p style="margin:32px 0"><a href="${esc(safeUrl)}" style="display:inline-block;background:#234b3c;color:#fff;text-decoration:none;padding:14px 23px;border-radius:9px;font-weight:700">${label}</a></p>${event==="verification"?'<p style="font-size:12px;color:#78857a">This link expires in 20 minutes. If you did not request it, ignore this message.</p>':""}<hr style="border:0;border-top:1px solid #edf0ea;margin:32px 0 15px"><p style="font-size:12px;color:#7d8981">fixa. · A product by Bespoke Technologies</p></main></body></html>`;
 try{
  const r=await fetch(HOST,{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.FIXA_EMAIL_FROM,to:[to],subject,html,text:plain}),signal:AbortSignal.timeout(8000)});
  if(!r.ok){console.error("[fixa] transactional email delivery failed",r.status);return false;}return true;
 }catch{console.error("[fixa] transactional email delivery unavailable");return false;}
}
