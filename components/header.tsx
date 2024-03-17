import NavLink from 'next/link'
import styles from './header.module.css'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import stringToColor from '../functions/stringToColor'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState<boolean>(status === 'loading')

  useEffect(() => {
    const loaded = status !== 'loading'
    if (loaded) {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [status])

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
            <div className={`nojs-show ${loading ? styles.loading : styles.loaded}`}>
              <div className={styles.userBox}>
                {session?.user && (
                  <>
                    {session.user.image && (
                      <span
                        style={{ backgroundColor: stringToColor(session.user.email) }}
                        className={styles.avatar}
                      >
                        {session.user.email?.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className={styles.signedInText}>
                      <small>Signed in as</small>
                      <br />
                      <strong>{session.user.email ?? session.user.name}</strong>
                    </div>
                  </>
                )}
                <a
                  href="/api/auth/signout"
                  className={styles.buttonPrimary}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Sign&nbsp;out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
