import Layout from '../components/layout'
import { useAuth } from '../authentication/use-auth'

export default function StatusPage() {
  
  const { authenticated, keycloak } = useAuth()

  if (!authenticated) {
    keycloak.login()
    return null
  }

  return (
    <Layout title="Status">
      <p></p>
    </Layout>
  )
}
