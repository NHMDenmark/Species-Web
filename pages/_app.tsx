import { SessionProvider } from 'next-auth/react'
import '../styles/output.css'
import './styles.css'

import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'

import { useEffect, useState, useRef } from 'react'
import keycloak from '../keycloak'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {

  const [kcReady, setKcReady] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    keycloak
      .init({
        onLoad: 'login-required',   // force login if not logged in
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        if (!authenticated) {
          keycloak.login()
        } else {
          setKcReady(true)

          // keep token alive
          setInterval(() => {
            keycloak.updateToken(60).catch(() => {
              keycloak.login()
            })
          }, 60000)
        }
      })
      .catch((err) => {
        console.error('Keycloak init failed', err)
      })
  }, [])

  // block UI until keycloak ready
  if (!kcReady) {
    return <div>Authenticating...</div>
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}