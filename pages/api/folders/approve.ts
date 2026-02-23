import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/prisma'
import { verifyToken } from '../../../verify-token'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = authHeader.replace('Bearer ', '')

  let payload
  try {
    payload = await verifyToken(token)
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
  
  const author = payload.name || payload.email
  const time = new Date()

  await prisma.folder.update({
    where: { id: req.body.folder_id 
    },
    data: req.body.approve
      ? {
          approved_at: time,
          approved_by: author,
        }
      : {
          approved_at: null,
          approved_by: null,
        },
  })

  res.json({
    approved_at: time,
    approved_by: author,
  })
}
