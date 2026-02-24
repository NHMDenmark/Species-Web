import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(
    `${process.env.NEXT_PUBLIC_KC_URL}/realms/${process.env.NEXT_PUBLIC_KC_REALM}/protocol/openid-connect/certs`
  )
)

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `${process.env.NEXT_PUBLIC_KC_URL}/realms/${process.env.NEXT_PUBLIC_KC_REALM}`,
    audience: process.env.NEXT_PUBLIC_KC_CLIENT,
  })
  console.log('Token payload:', payload)
  return payload
}