"use client";

import {useEffect,useState} from "react";
import {Download,Share2,X} from "lucide-react";
import {useFixaPwa} from "@/components/pwa-provider";
import {
  eligibleForInstall,recordDashboardVisit,
  INSTALL_SNOOZE_MS,type InstallHistory
} from "@/lib/pwa-install-policy";

const HISTORY_KEY="fixa:pwa-history-v1";
const SESSION_KEY="fixa:pwa-visited-this-session";

function readHistory():InstallHistory|undefined{
 try{
  const saved=localStorage.getItem(HISTORY_KEY);
  if(!saved)return;
  const value:unknown=JSON.parse(saved);
  if(typeof value!=="object"||value===null)return;
  const state=value as Partial<InstallHistory>;
  if([state.firstSeenAt,state.lastVisitAt,state.visits,state.quietUntil].every(x=>typeof x==="number"&&Number.isFinite(x)))return state as InstallHistory;
 }catch{}
}
function iosSafari():boolean{
 const agent=navigator.userAgent;
 return /iPad|iPhone|iPod/.test(agent)&&/Safari/.test(agent)&&
  !/CriOS|FxiOS|EdgiOS|OPiOS/.test(agent);
}
/** Render only on the authenticated dashboard; never overlay job forms or tickets. */
export function PwaInstallSuggestion({hasRepairJobs}:{hasRepairJobs:boolean}){
 const {installEvent,installed,invokeBrowserInstall}=useFixaPwa();
 const [history,setHistory]=useState<InstallHistory|undefined>();
 const [ready,setReady]=useState(false);
 const [mobile,setMobile]=useState(false);
 const [ios,setIos]=useState(false);
 const [guide,setGuide]=useState(false);
 useEffect(()=>{
   try{
     const now=Date.now(),previous=readHistory();
     const alreadyCounted=sessionStorage.getItem(SESSION_KEY)==="1";
     const next=alreadyCounted&&previous?previous:recordDashboardVisit(previous,now);
     if(!alreadyCounted){
       sessionStorage.setItem(SESSION_KEY,"1");
       localStorage.setItem(HISTORY_KEY,JSON.stringify(next));
     }
     setHistory(next);
   }catch{
     // No storage? Don't show a potentially repetitive prompt.
   }
   setMobile(window.matchMedia("(max-width: 760px)").matches);
   setIos(iosSafari());
   const timer=window.setTimeout(()=>setReady(true),15000);
   return ()=>window.clearTimeout(timer);
 },[]);
 const now=Date.now();
 const visible=history&&eligibleForInstall({
   history,now,mobile,hasRepairJobs,installed,
   supported:Boolean(installEvent)||ios,
   ready
 });
 if(!visible)return null;
 function snooze(){
   if(!history)return;
   const next={...history,quietUntil:Date.now()+INSTALL_SNOOZE_MS};
   try{localStorage.setItem(HISTORY_KEY,JSON.stringify(next));}catch{}
   setHistory(next);
 }
 async function install(){
   if(ios){setGuide(true);return;}
   const result=await invokeBrowserInstall();
   if(result!=="accepted")snooze();
 }
 return <aside className="fixa-install-suggestion" aria-label="Optional Fixa app installation">
   <div className="fixa-install-identity" aria-hidden="true">f<span>.</span></div>
   <div className="fixa-install-copy">
    <strong>Keep Fixa a tap away.</strong>
    <p>{guide?"In Safari, tap Share, then Add to Home Screen.": "Add your repair workspace to your Home Screen."}</p>
   </div>
   {!guide&&<button className="fixa-install-action" onClick={install} type="button">
     {ios?<Share2 size={15} aria-hidden="true"/>:<Download size={15} aria-hidden="true"/>}
     {ios?"How to":"Install"}
   </button>}
   {guide&&<button className="fixa-install-action" onClick={snooze} type="button">Got it</button>}
   <button className="fixa-install-dismiss" aria-label="Hide installation suggestion for 90 days" title="Not now" onClick={snooze} type="button"><X size={16} aria-hidden="true"/></button>
 </aside>;
}
