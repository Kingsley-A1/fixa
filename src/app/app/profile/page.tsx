import {requireWorkspace} from "@/lib/auth";
import {db} from "@/lib/db";
import {saveTechnicianProfile,submitTechnicianProfile} from "@/app/marketplace-actions";
import {FormShell,Field} from "@/components/forms";
import Link from "next/link";
import {ShieldCheck,ChevronLeft} from "lucide-react";
export default async function MyProfile(){
 const {business,user}=await requireWorkspace();
 const p=await db.technicianProfile.findUnique({where:{businessId_ownerUserId:{businessId:business.id,ownerUserId:user.id}}});
 return <main id="main-content" className="workspace fade-in">
  <div className="page-head"><div className="intro"><Link className="text-link" href="/app"><ChevronLeft size={16}/> Workspace</Link><h1>Technician profile</h1><p>Your professional identity is private until Fixa approves its publication.</p></div><span className="pill">{p?.status.toLowerCase()||"not created"}</span></div>
  <div className="split"><section className="panel form-panel">
    <h3 style={{marginBottom:20}}>Profile details</h3>
    <FormShell key={p?.updatedAt?.toISOString()||"new"} action={saveTechnicianProfile} button="Save profile">
     <Field name="displayName" label="Public display name" required placeholder="Your professional name" defaultValue={p?.displayName||user.name}/>
     <Field name="headline" label="Short headline" placeholder="e.g. Phone and laptop repair technician" defaultValue={p?.headline||""}/>
     <label className="field"><span>About your work (optional)</span><textarea rows={4} name="bio" defaultValue={p?.bio||""} maxLength={650} placeholder="Your expertise, experience and types of work you accept."/></label>
     <Field name="publicPhone" label="Public business phone" type="tel" required placeholder="080XXXXXXXX" defaultValue={p?.publicPhone||""}/>
     <div className="form-grid">
      <Field name="state" label="State" placeholder="Cross River" required defaultValue={p?.state||""}/>
      <Field name="city" label="City" placeholder="Calabar" required defaultValue={p?.city||""}/>
      <Field name="area" label="Service area" placeholder="Marian Road" defaultValue={p?.area||""}/>
     </div>
     <label className="field"><span>Repair specialties (comma-separated) *</span><input name="specialties" required defaultValue={p?.specialties.join(", ")||""} placeholder="Screen repair, battery, software"/></label>
     <label className="field"><span>Device categories (comma-separated) *</span><input name="deviceClasses" required defaultValue={p?.deviceClasses.join(", ")||"Phone, Laptop"} placeholder="Phone, Laptop, Tablet"/></label>
     <p className="form-hint">Be accurate. Specialty claims are not certifications. Changing an approved listing sends it back to draft for review.</p>
    </FormShell>
    {p&&["DRAFT","REJECTED"].includes(p.status)&&<form action={submitTechnicianProfile} style={{marginTop:22}}><input type="hidden" name="profileId" value={p.id}/><button type="submit" className="btn">Submit for publication review</button></form>}
   </section>
   <section className="panel info-box" style={{alignSelf:"start"}}><ShieldCheck color="#67875b" size={22}/><h3 style={{marginTop:16}}>How verification works</h3><p className="muted" style={{lineHeight:1.7,marginTop:10}}>New profiles remain private until the Fixa team checks the business contact and service area. We do not imply that a phone check proves technical competence.</p><div style={{marginTop:18}} className="detail-item"><label>Listing status</label><strong>{p?.status||"NOT CREATED"}</strong></div>{p?.status==="APPROVED"&&<Link href={"/technicians/"+p.slug} className="text-link" style={{marginTop:20}}>View public profile</Link>}</section>
  </div>
 </main>;
}
