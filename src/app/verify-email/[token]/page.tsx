import {currentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
import {FixaWordmark} from "@/components/fixa-wordmark";
import {VerifyEmailForm} from "@/components/verify-email-form";
export default async function VerifyEmailPage({params}:{params:Promise<{token:string}>}){
 const user=await currentUser();if(!user)redirect("/login");
 const {token}=await params;
 if(!/^[\w-]{30,100}$/.test(token))redirect("/app/profile");
 return <main className="review-page" id="main-content"><div className="review-shell"><FixaWordmark/><section className="panel form-panel" style={{marginTop:28}}><p className="eyebrow">ACCOUNT SECURITY</p><h1 style={{margin:"12px 0"}}>Confirm your email</h1><p className="muted" style={{marginBottom:25}}>One quick step to verify your Fixa email address.</p><VerifyEmailForm token={token}/></section></div></main>;
}
