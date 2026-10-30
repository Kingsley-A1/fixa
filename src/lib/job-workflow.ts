import type {JobStatus} from "@prisma/client";

/** Canonical workflow shared by server authorization and client controls. */
export const NEXT_JOB_STATUSES:Record<JobStatus,JobStatus[]>={
 RECEIVED:["DIAGNOSING","AWAITING_APPROVAL","IN_PROGRESS","CANCELLED"],
 DIAGNOSING:["AWAITING_APPROVAL","IN_PROGRESS","CANCELLED"],
 AWAITING_APPROVAL:["IN_PROGRESS","CANCELLED"],
 IN_PROGRESS:["AWAITING_APPROVAL","READY","CANCELLED"],
 READY:["IN_PROGRESS","COLLECTED","CANCELLED"],
 COLLECTED:[],CANCELLED:[]
};
export function mayTransition(from:JobStatus,to:JobStatus){
 return NEXT_JOB_STATUSES[from].includes(to);
}
