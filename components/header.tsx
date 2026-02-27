import NavLink from 'next/link'
import styles from './header.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import stringToColor from '../functions/stringToColor'
import { happiness } from '../happiness'
import { useAuth } from '../authentication/use-auth'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  

  const [user, setUser] = useState<any>(null)
  const { keycloak, authenticated } = useAuth()

  if (!authenticated) return null

  useEffect(() => {
    if (keycloak.authenticated && keycloak.tokenParsed) {
      setUser(keycloak.tokenParsed)
    }
  }, [])

  const router = useRouter()

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <nav>
            <div className={styles.navItems}>
              <NavLink
                className={`${styles.navItem} ${router.pathname == '/' ? styles.active : ''}`}
                href="/"
              >
                Status
              </NavLink>
              <NavLink
                className={`${styles.navItem} ${
                  router.pathname == '/folders' ? styles.active : ''
                }`}
                href="/folders"
              >
                Folders
              </NavLink>
              <NavLink
                className={`${styles.navItem} ${
                  router.pathname == '/activity' ? styles.active : ''
                }`}
                href="/activity"
              >
                Activity
              </NavLink>
            </div>
          </nav>
          <div className={styles.signedInStatus}>
            <div>
              <div className={styles.userBox}>
                {user && (
                  <>
                    <span
                      style={{ backgroundColor: stringToColor(user.email || user.preferred_username) }}
                      className={styles.avatar}
                    >
                      {(user.email || user.preferred_username || 'U')
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>

                    <div className={styles.signedInText}>
                      <small>Signed in as</small>
                      <br />
                      <strong>{user.preferred_username || user.name || user.email}</strong>
                    </div>
                  </>
                )}
                <a
                  href="#"
                  className={styles.buttonPrimary}
                  onClick={(e) => {
                    e.preventDefault()

                    keycloak.logout({
                      redirectUri: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
                    })
                  }}
                >
                  Sign&nbsp;out
                </a>
              </div>
              <br/>
              <p>&emsp;{happiness}</p>
              </div>
            </div>
          </div>
        </div>
      
    </header>
  )
}
