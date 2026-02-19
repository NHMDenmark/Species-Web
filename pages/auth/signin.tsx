import { signIn } from "next-auth/react"
import { useEffect } from "react";

export default function SignIn() {
  useEffect(() => {
    //signIn('auth0', { callbackUrl: process.env.NEXT_PUBLIC_URL }, { prompt: "login" })
    signIn('keycloak', { callbackUrl: process.env.NEXT_PUBLIC_URL })
  }, [])
  console.log("Redirecting to login...")
  return <p>Redirecting to login...</p> // together with kc change
}