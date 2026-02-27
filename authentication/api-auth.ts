import { verifyToken } from './verify-token'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = await verifyToken(token)
    return payload
  } catch (err) {
    console.error('Token invalid', err)
    return null
  }
}