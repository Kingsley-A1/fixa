"use client";
import {useActionState,useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Camera,Images,Plus,Trash2,ArrowUpRight} from "lucide-react";
import {createWorkSample,submitWorkSample,removeWorkImage,saveWorkDetails,unpublishWorkSample} from "@/app/work-actions";
import {FormShell} from "@/components/forms";
type Job={id:string;label:string;title:string};
type Sample={id:string;title:string;description:string|null;status:string;jobId:string;images:{id:string;position:number}[]};
function PhotoUpload({id,remaining}:{id:string;remaining:number}){
 const router=useRouter(),[working,setWorking]=useState(false),[message,setMessage]=useState("");
 async function handle(file:File|undefined){
  if(!file)return;
  setMessage("");setWorking(true);
  try{
   const bitmap=await createImageBitmap(file);
   const scale=Math.min(1,1440/Math.max(bitmap.width,bitmap.height));
   const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Image processing is not available.");
   ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
   const converted=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",.82));
   if(!converted||converted.type!=="image/webp"||converted.size>2_000_000)throw Error("Choose a smaller photo.");
   const form=new FormData();form.set("sampleId",id);form.set("image",new File([converted],"work.webp",{type:"image/webp"}));
   const r=await fetch("/api/work/upload",{method:"POST",body:form});
   const data=await r.json() as {error?:string};
   if(!r.ok)throw Error(data.error||"Unable to upload photo.");
   router.refresh();
  }catch(error){setMessage(error instanceof Error?error.message:"Upload failed.");}
  finally{setWorking(false);}
 }
 if(remaining<=0)return null;
 return <label className="portfolio-add-photo">
   <input type="file" accept="image/jpeg,image/png,image/webp" disabled={working} aria-label="Choose a finished repair photograph" onChange={e=>{void handle(e.target.files?.[0]);e.currentTarget.value="";}}/>
   <Camera size={21} strokeWidth={1.8}/><span>{working?"Preparing photo…":"Add photo"}</span>
   {message&&<span className="portfolio-upload-error" role="alert">{message}</span>}
 </label>;
}
function CreateWork({jobs}:{jobs:Job[]}){
 const [state,action,pending]=useActionState(createWorkSample,{});
 const [jobId,setJobId]=useState(jobs[0]?.id||"");
 const router=useRouter();
 useEffect(()=>{if(state.success)router.refresh();},[state.success,router]);
 const selected=jobs.find(j=>j.id===jobId);
 return <details className="portfolio-new"><summary><Plus size={17}/> Add finished work</summary>
 <form action={action} className="form-stack" style={{paddingTop:18}}>
 <label className="field"><span>Completed repair</span><select required name="jobId" value={jobId} onChange={e=>setJobId(e.target.value)}>{jobs.map(j=><option key={j.id} value={j.id}>{j.label}</option>)}</select></label>
 <label className="field"><span>Work title</span><input name="title" key={jobId} defaultValue={selected?.title||""} minLength={4} maxLength={95} required/></label>
 <label className="field"><span>Short description (optional)</span><textarea rows={2} maxLength={350} name="description" placeholder="What was repaired?"/></label>
 {state.error&&<p role="alert" className="form-error">{state.error}</p>}
 <button className="btn primary" type="submit" disabled={pending}>{pending?"Saving…":"Create private draft"}</button>
 </form></details>;
}
export function WorkPortfolioManager({jobs,samples}:{jobs:Job[];samples:Sample[]}){
 return <section id="portfolio" className="panel portfolio-manager" aria-label="Your work portfolio">
 <div className="portfolio-header"><div><p className="eyebrow">YOUR REPAIR WORK</p><h2>Work portfolio</h2><p className="muted">Only the work you choose to share. Nothing is published automatically.</p></div></div>
 {samples.length>0&&<div className="portfolio-drafts">{samples.map(s=><article className="portfolio-draft" key={s.id}>
  <div className="portfolio-draft-head"><div><h3>{s.title}</h3><p className="muted">{s.status==="APPROVED"?"Published":s.status==="PENDING"?"Awaiting review":s.status==="REJECTED"?"Needs changes":"Private draft"}</p></div></div>
  <div className="portfolio-photos">{s.images.map(photo=><div className="portfolio-edit-photo" key={photo.id}>
  <Image unoptimized src={"/api/work/media/"+photo.id} width={460} height={520} alt={s.title+" photo "+(photo.position+1)}/>
  {["DRAFT","REJECTED"].includes(s.status)&&<form action={removeWorkImage}><input type="hidden" name="id" value={photo.id}/><button type="submit" className="portfolio-remove" aria-label="Remove photograph"><Trash2 size={15}/></button></form>}
  </div>)}
  {["DRAFT","REJECTED"].includes(s.status)&&<PhotoUpload id={s.id} remaining={3-s.images.length}/>}
  </div>
  {["DRAFT","REJECTED"].includes(s.status)&&<details className="portfolio-edit-details"><summary>Edit details</summary><FormShell action={saveWorkDetails} button="Save changes"><input name="id" type="hidden" value={s.id}/><label className="field"><span>Title</span><input name="title" defaultValue={s.title} minLength={4} maxLength={95} required/></label><label className="field"><span>Short description (optional)</span><textarea rows={2} maxLength={350} name="description" defaultValue={s.description||""}/></label></FormShell></details>}
  {s.status==="APPROVED"&&<form action={unpublishWorkSample}><input name="id" type="hidden" value={s.id}/><button className="portfolio-unpublish" type="submit">Remove from public profile</button></form>}
  {["DRAFT","REJECTED"].includes(s.status)&&s.images.length>0&&<form action={submitWorkSample} className="portfolio-publish"><input name="id" type="hidden" value={s.id}/>
    <label className="portfolio-consent"><input type="checkbox" name="permission" value="yes" required/><span>I have permission to share these images and have removed private customer or device information.</span></label>
    <button className="btn" type="submit">Submit for review <ArrowUpRight size={15}/></button>
   </form>}
 </article>)}</div>}
 {jobs.length>0?<CreateWork jobs={jobs}/>:samples.length===0&&<div className="portfolio-empty"><Images size={25}/><p>Finished repairs assigned to you can become a portfolio of your work.</p></div>}
 </section>;
}
