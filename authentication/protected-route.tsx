import { useEffect, useRef } from 'react'
import { useAuth } from './use-auth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { authenticated, ready, keycloak } = useAuth()

  const loginTriggered = useRef(false)

  useEffect(() => {
    if (!ready) return

    if (!authenticated && !loginTriggered.current) {
      loginTriggered.current = true
      keycloak.login()
    }
  }, [ready, authenticated, keycloak])

  // wait for keycloak initialization
  if (!ready) {
    return <div>Authenticating...</div>
  }

  // while redirecting to login
  if (!authenticated) {
    return null
  }

  return <>{children}</>
}