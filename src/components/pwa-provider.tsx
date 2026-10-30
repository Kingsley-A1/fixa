"use client";

import {createContext,useContext,useEffect,useState} from "react";

type InstallChoice={outcome:"accepted"|"dismissed";platform?:string};
type DeferredInstallEvent=Event&{
  prompt:()=>Promise<void>;
  userChoice:Promise<InstallChoice>;
};
type PwaContextValue={
  installEvent:DeferredInstallEvent|null;
  installed:boolean;
  invokeBrowserInstall:()=>Promise<"accepted"|"dismissed"|"unavailable">;
};
const PwaContext=createContext<PwaContextValue>({
  installEvent:null,installed:false,
  invokeBrowserInstall:async()=>"unavailable"
});
export function PwaProvider({children}:{children:React.ReactNode}){
  const [installEvent,setInstallEvent]=useState<DeferredInstallEvent|null>(null);
  const [installed,setInstalled]=useState(false);
  useEffect(()=>{
    const standalone=window.matchMedia("(display-mode: standalone)").matches||
      Boolean((navigator as Navigator&{standalone?:boolean}).standalone);
    setInstalled(standalone);
    const offer=(e:Event)=>{
      if("prompt" in e){
        e.preventDefault();
        setInstallEvent(e as DeferredInstallEvent);
      }
    };
    const completed=()=>{
      setInstalled(true);
      setInstallEvent(null);
      try{localStorage.setItem("fixa:pwa-installed-at",String(Date.now()));}catch{}
    };
    window.addEventListener("beforeinstallprompt",offer);
    window.addEventListener("appinstalled",completed);
    if("serviceWorker" in navigator&&location.protocol==="https:"){
      navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{
        // The website remains functional and installation can still be browser-managed.
      });
    }
    return ()=>{
      window.removeEventListener("beforeinstallprompt",offer);
      window.removeEventListener("appinstalled",completed);
    };
  },[]);
  async function invokeBrowserInstall(){
    if(!installEvent||installed)return "unavailable" as const;
    const current=installEvent;
    setInstallEvent(null);
    try{
      await current.prompt();
      const choice=await current.userChoice;
      if(choice.outcome==="accepted")setInstalled(true);
      return choice.outcome;
    }catch{return "unavailable" as const;}
  }
  const context:PwaContextValue={installEvent,installed,invokeBrowserInstall};
  return <PwaContext.Provider value={context}>{children}</PwaContext.Provider>;
}
export function useFixaPwa(){return useContext(PwaContext);}
