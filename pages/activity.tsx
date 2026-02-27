import Layout from "../components/layout"  
import ProtectedRoute from "../authentication/protected-route"

export default function ActivityPage() {
  
  return (
    <ProtectedRoute>  
      <Layout title="Activity">
        <p>
          
        </p>
      </Layout>
    </ProtectedRoute>
  )
}
