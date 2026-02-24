import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/prisma'
import { verifyToken } from '../../authentication/verify-token'
import { FolderVersion } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' })
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = authHeader.replace('Bearer ', '')
  let payload
  try {
    payload = await verifyToken(token)
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const author = payload.name || payload.email
  const time = new Date()
  const folderVersion: FolderVersion = req.body

  try {
    await prisma.folderVersion.create({
      data: {
        ...folderVersion,
        id: undefined,        // ensure Prisma auto-generates ID
        created_at: time,
        created_by: author,
      },
    })
  } catch (error) {
    console.error('Error creating folder version:', error)
    return res.status(500).json({ message: 'Failed to create folder version', error })
  }

  return res.status(200).json({
    created_at: time,
    created_by: author,
  })
}
