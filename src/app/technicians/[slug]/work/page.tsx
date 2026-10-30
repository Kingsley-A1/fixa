import Link from "next/link";
import {db} from "@/lib/db";import {notFound} from "next/navigation";
import {FixaWordmark} from "@/components/fixa-wordmark";
import {WorkCard} from "@/components/work-card";
export const dynamic="force-dynamic";
export default async function Portfolio({params}:{params:Promise<{slug:string}>}){
 if(process.env.ENABLE_DISCOVERY!=="true"||process.env.ENABLE_PORTFOLIO!=="true")notFound();
 const {slug}=await params;
 const profile=await db.technicianProfile.findFirst({where:{slug,status:"APPROVED"},select:{id:true,displayName:true}});
 if(!profile)notFound();
 const works=await db.workSample.findMany({where:{profileId:profile.id,status:"APPROVED",images:{some:{}}},select:{id:true,title:true,images:{select:{id:true},orderBy:{position:"asc"},take:1}},orderBy:{publishedAt:"desc"},take:60});
 return <div className="marketing public-discovery"><header className="site-header"><FixaWordmark/><Link href={"/technicians/"+slug} className="login-link">Back to profile</Link></header><main className="profile-public" id="main-content"><span className="eyebrow">REPAIR PORTFOLIO</span><h1 style={{margin:"12px 0 8px"}}>{profile.displayName}&apos;s work</h1><p className="muted">Selected repairs shared with permission.</p>{works.length>0?<div className="public-work-grid" style={{marginTop:32}}>{works.map(w=>w.images[0]&&<WorkCard key={w.id} id={w.images[0].id} title={w.title}/>)}</div>:<p className="muted" style={{marginTop:32}}>No published work yet.</p>}</main></div>;
}
