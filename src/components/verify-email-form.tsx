"use client";
import {useActionState} from "react";import {confirmEmail} from "@/app/email-actions";
export function VerifyEmailForm({token}:{token:string}){
 const [state,action,pending]=useActionState(confirmEmail,{});
 return <form className="form-stack" action={action}>
 <input type="hidden" name="token" value={token}/>
 <button className="btn primary" type="submit" disabled={pending}>{pending?"Verifying…":"Confirm email address"}</button>
 {state.success&&<p role="status" className="form-success">{state.success}</p>}
 {state.error&&<p role="alert" className="form-error">{state.error}</p>}
 </form>;
}
