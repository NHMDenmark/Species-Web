import '../styles/output.css'
import './styles.css'

import type { AppProps } from 'next/app'
import { AuthProvider } from '../authentication/auth-provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}