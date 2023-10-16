import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { prisma } from '../../prisma/prisma'
import { authOptions } from './auth/[...nextauth]'
import { FolderVersion } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const session = await getServerSession(req, res, authOptions)

  const folderVersion: FolderVersion = req.body

  const time = new Date()
  const author = session?.user?.email
  try {
    await prisma.folderVersion.create({
      data: { ...folderVersion, id: undefined, created_at: time, created_by: author },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }

  res.json({
    created_at: time,
    created_by: author,
  })
}
