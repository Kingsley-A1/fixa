"use client";
import {useActionState} from "react";import {submitServiceReview} from "@/app/marketplace-actions";import {LoaderCircle,CheckCircle2} from "lucide-react";
export function ReviewForm({token}:{token:string}){
 const [result,submit,pending]=useActionState(submitServiceReview,{});
 if(result.success)return <div role="status" className="empty" style={{padding:"30px 15px"}}><CheckCircle2 color="#397b56" size={32}/><h3>Thank you for your feedback.</h3><p>Your review is awaiting moderation. You can close this page.</p></div>;
 return <form action={submit} className="form-stack"><input type="hidden" name="token" value={token}/><label className="field"><span>Overall service experience *</span><select name="rating" required defaultValue=""><option value="" disabled>Choose your rating</option>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label><label className="field"><span>What happened? *</span><textarea name="comment" required minLength={15} maxLength={1500} rows={5} placeholder="Describe the work, communication, timeliness and outcome in your own words. Avoid phone numbers and private details."/></label>{result.error&&<p role="alert" className="form-error">{result.error}</p>}<button className="btn primary submit" disabled={pending}>{pending?<LoaderCircle className="spin" size={17}/>:null} Submit honest review</button></form>;
}
