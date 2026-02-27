import { createContext } from 'react'
import keycloak from './keycloak'

export type AuthContextType = {
  keycloak: typeof keycloak
  authenticated: boolean
  ready: boolean
  token?: string
}

export const AuthContext = createContext<AuthContextType | null>(null)