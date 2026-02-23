import { useContext } from 'react'
import { AuthContext } from './auth-context'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('use-auth must be used inside auth-context')
  }

  return context
}