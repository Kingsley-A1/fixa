import Link from "next/link";
export function GoogleSignIn({linkMode=false}:{linkMode?:boolean}){
 return <Link className="google-signin" href={linkMode?"/api/auth/google/start?mode=link":"/api/auth/google/start"}>
 <svg viewBox="0 0 24 24" width="20" height="20" role="img" aria-label="Google">
 <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.76 2.99-4.34 2.99-7.36Z"/>
 <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.41l-3.23-2.5c-.9.6-2.04.96-3.39.96a6 6 0 0 1-5.64-4.17H3.03v2.58A10 10 0 0 0 12 22Z"/>
 <path fill="#FBBC05" d="M6.36 13.88a6.01 6.01 0 0 1 0-3.76V7.54H3.03a10 10 0 0 0 0 8.92l3.33-2.58Z"/>
 <path fill="#EA4335" d="M12 5.95c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.97 5.54l3.33 2.58A6 6 0 0 1 12 5.95Z"/>
 </svg>
 {linkMode?"Connect Google account":"Continue with Google"}
 </Link>;
}
