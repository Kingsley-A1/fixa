/** Product policy for a quiet, user-initiated PWA installation suggestion. */
export type InstallHistory={
  firstSeenAt:number;
  lastVisitAt:number;
  visits:number;
  quietUntil:number;
};

export const INSTALL_SNOOZE_DAYS=90;
export const INSTALL_MIN_VISIT_GAP_MS=30*60*1000;
export const INSTALL_SNOOZE_MS=INSTALL_SNOOZE_DAYS*24*60*60*1000;

export function recordDashboardVisit(previous:InstallHistory|undefined,now:number):InstallHistory{
  if(!previous||!Number.isFinite(previous.firstSeenAt)||previous.firstSeenAt>now){
    return {firstSeenAt:now,lastVisitAt:now,visits:1,quietUntil:0};
  }
  if(now-previous.lastVisitAt<INSTALL_MIN_VISIT_GAP_MS)return previous;
  return {...previous,lastVisitAt:now,visits:Math.max(0,previous.visits)+1};
}
export function eligibleForInstall(args:{
 history:InstallHistory;
 now:number;
 mobile:boolean;
 hasRepairJobs:boolean;
 installed:boolean;
 supported:boolean;
 ready:boolean;
}):boolean{
  const {history,now,mobile,hasRepairJobs,installed,supported,ready}=args;
  return Boolean(
    mobile&&hasRepairJobs&&!installed&&supported&&ready&&
    history.visits>=2&&history.firstSeenAt<=now-INSTALL_MIN_VISIT_GAP_MS&&
    now>=history.quietUntil
  );
}
