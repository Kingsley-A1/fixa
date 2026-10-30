import {db} from "@/lib/db";import {notFound} from "next/navigation";
import {FixaWordmark} from "@/components/fixa-wordmark";
import {ReviewForm} from "@/components/review-form";
export const dynamic="force-dynamic";
export default async function Review({params}:{params:Promise<{token:string}>}){
 if(process.env.ENABLE_DISCOVERY!=="true")notFound();
 const {token}=await params;if(!/^[0-9a-f-]{36}$/i.test(token))notFound();
 const invite=await db.reviewInvitation.findUnique({where:{token},include:{job:{select:{status:true,assignedProfileId:true}},profile:{select:{id:true,displayName:true,status:true}}}});
 if(!invite||invite.usedAt||invite.expiresAt<new Date()||invite.job.status!=="COLLECTED"||invite.profile.status!=="APPROVED"||invite.job.assignedProfileId!==invite.profileId)notFound();
 return <main id="main-content" className="review-page"><div className="review-shell"><FixaWordmark/><section className="panel form-panel" style={{marginTop:30}}><span className="eyebrow">PRIVATE REVIEW INVITATION</span><h1 style={{margin:"12px 0"}}>How was your repair experience?</h1><p className="muted" style={{marginBottom:20}}>Leave genuine feedback about your completed service with {invite.profile.displayName}. We never publish your private job details. Your review is moderated before publication.</p><ReviewForm token={token}/></section><p className="muted" style={{fontSize:12,marginTop:18,textAlign:"center"}}>This link can be used once and expires automatically. Reviews may be positive or negative.</p></div></main>;
}
