"use client";
import {useActionState} from "react";
import {requestEmailVerification} from "@/app/email-actions";
export function VerifyEmailButton(){
 const [state,submit,pending]=useActionState(requestEmailVerification,{});
 return <div className="verify-line"><form action={submit}><button className="btn" disabled={pending} type="submit">{pending?"Sending…":"Send verification email"}</button></form>
 {state.success&&<p role="status" className="form-success">{state.success}</p>}
 {state.error&&<p role="alert" className="form-error">{state.error}</p>}</div>;
}
