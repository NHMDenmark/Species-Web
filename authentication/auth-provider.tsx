import { createContext, useContext, useEffect, useState, useRef } from 'react'
import keycloak from './keycloak'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    keycloak
      .init({
        onLoad: 'check-sso',   // not forcing login globally
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth: boolean) => {
        setAuthenticated(auth)
        setReady(true)

        if (auth) {
          setInterval(() => {
            keycloak.updateToken(60).catch(() => keycloak.login())
          }, 60000)
        }
      })
      .catch((err) => {
        console.error('Keycloak init failed', err)
      })
  }, [])

  if (!ready) return <div>Click back to login...</div>

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        authenticated,
        token: keycloak.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}