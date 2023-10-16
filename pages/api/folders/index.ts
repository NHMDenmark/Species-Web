import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const currentPage = req.body.currentPage
  const perPage = req.body.perPage
  const totalCount = await prisma.folder.count()
  const pageCount = Math.ceil(totalCount / perPage)
  const folders = await prisma.folder.findMany({
    include: { folder_versions: { orderBy: { created_at: 'desc' } } },
    skip: currentPage > 1 ? (currentPage - 1) * perPage : undefined,
    take: perPage,
  })
  res.json({
    meta: {
      itemCount: totalCount,
      pageCount: pageCount,
    },
    result: folders,
  })
}
