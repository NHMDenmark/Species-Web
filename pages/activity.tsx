import { useAuth } from "../authentication/use-auth"
import Layout from "../components/layout"  

export default function ActivityPage() {

  const { authenticated, keycloak } = useAuth()
    
      if (!authenticated) {
        keycloak.login()
        return null
      }

  return (
    <Layout title="Activity">
      <p>
        
      </p>
    </Layout>
  )
}
