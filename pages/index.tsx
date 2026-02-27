import Layout from '../components/layout'
import ProtectedRoute from '../authentication/protected-route'

export default function StatusPage() {

  return (
    <ProtectedRoute>
      <Layout title="Status">
        <p></p>
      </Layout>
    </ProtectedRoute>
  )
}
