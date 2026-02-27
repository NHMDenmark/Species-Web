import { useEffect } from 'react'
import { useAuth } from './use-auth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { authenticated, ready, keycloak } = useAuth()

  useEffect(() => {
    if (ready && !authenticated) {
      keycloak.login()
    }
  }, [ready, authenticated])

  if (!ready) return null
  if (!authenticated) return null

  return <>{children}</>
}