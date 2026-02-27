import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(
    `${process.env.NEXT_PUBLIC_KC_URL}/realms/${process.env.NEXT_PUBLIC_KC_REALM}/protocol/openid-connect/certs`
  )
)

export async function verifyToken(token: string) {

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `${process.env.NEXT_PUBLIC_KC_URL}/realms/${process.env.NEXT_PUBLIC_KC_REALM}`,
  })

  const ALLOWED_CLIENTS = process.env.NEXT_PUBLIC_KC_CLIENTS!.split(',')

  // Keycloak client validation
  const client =
    payload.azp ||
    payload.aud

  const clientList = Array.isArray(client)
    ? client
    : [client]

  const allowed = clientList.some(c =>
    ALLOWED_CLIENTS.includes(c as string)
  )
  console.log(allowed, clientList, ALLOWED_CLIENTS)
  if (!allowed) {
    throw new Error('Client not allowed')
  }

  return payload
}
/*
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `${process.env.NEXT_PUBLIC_KC_URL}/realms/${process.env.NEXT_PUBLIC_KC_REALM}`,
    audience: process.env.NEXT_PUBLIC_KC_CLIENT
  })
  console.log('Token payload:', payload)
  return payload
}*/