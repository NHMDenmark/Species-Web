import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { prisma } from '../../../prisma/prisma'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const session = await getServerSession(req, res, authOptions)

  const time = new Date()
  const author = session?.user?.email
  await prisma.folder.update({
    where: {
      id: req.body.folder_id,
    },
    data: {
      approved_at: time,
      approved_by: author,
    },
  })
  res.json({
    approved_at: time,
    approved_by: author,
  })
}
