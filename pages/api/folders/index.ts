import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { currentPage, perPage, from, to, sessions, onlyNonApproved } = req.body

  const fromDate = from ? new Date(from) : undefined
  const toDate = to ? new Date(to) : undefined
  toDate?.setHours(23, 59, 59, 999)

  const whereCondition = {
    approved_at: onlyNonApproved ? null : undefined,
    session_started_at:
      sessions && sessions.length > 0
        ? {
            in: sessions.map((s: string) => new Date(s)),
          }
        : undefined,
    Specimen:
      fromDate && toDate
        ? {
            some: {
              date_asset_taken: {
                gte: fromDate.toISOString(),
                lte: toDate.toISOString(),
              },
            },
          }
        : undefined,
  }

  const folders = await prisma.folder.findMany({
    include: { folder_versions: { orderBy: { created_at: 'desc' } } },
    skip: currentPage > 1 ? (currentPage - 1) * perPage : undefined,
    take: perPage,
    where: whereCondition,
  })
  const totalCount = await prisma.folder.count({
    where: whereCondition,
  })
  const pageCount = Math.ceil(totalCount / perPage)
  res.json({
    meta: {
      itemCount: totalCount,
      pageCount: pageCount,
    },
    result: folders,
  })
}
