"use client";
import {useActionState,useState} from "react";
import {updateStatus} from "@/app/actions";
import type {JobStatus} from "@prisma/client";
import {NEXT_JOB_STATUSES} from "@/lib/job-workflow";
import {LoaderCircle} from "lucide-react";
export function JobStatusForm({id,current}:{id:string;current:JobStatus}){
 const [state,action,pending]=useActionState(updateStatus,{});
 const options=NEXT_JOB_STATUSES[current];
 const [next,setNext]=useState<JobStatus>(options[0]||current);
 if(!options.length)return <p className="muted">{current.toLowerCase()} · closed</p>;
 return <form className="form-stack" action={action}>
  <input type="hidden" name="id" value={id}/>
  <label className="field"><span>Next status</span><select name="status" value={next} onChange={e=>setNext(e.target.value as JobStatus)}>{options.map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></label>
  {next==="COLLECTED"&&<><label className="field"><span>Collected by *</span><input name="collectedByName" placeholder="Customer or authorized representative" required minLength={2} maxLength={120}/></label><label style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:12}}><input type="checkbox" name="handoverConfirmed" value="yes" required/> I verified collection authorization and the device was handed over.</label></>}
  <label className="field"><span>Internal note (optional)</span><textarea name="note" rows={2} maxLength={250} placeholder="Add useful context for the record."/></label>
  {state.error&&<p role="alert" className="form-error">{state.error}</p>}
  {state.success&&<p role="status" className="form-success">{state.success}</p>}
  <button className="btn primary submit" disabled={pending}>{pending?<LoaderCircle size={17} className="spin"/>:null}Save status</button>
 </form>;
}
