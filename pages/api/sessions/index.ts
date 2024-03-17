import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/prisma'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const sessions = await prisma.$queryRaw`SELECT 
      @row_number:=@row_number+1 AS session_index,
      session_start,
      folder_count,
      approved_folder_count,
      overall_min_date_asset_taken,
      overall_max_date_asset_taken
    FROM (
      SELECT 
          f.session_started_at AS session_start,
          COUNT(DISTINCT f.id) AS folder_count,
          COUNT(DISTINCT CASE WHEN f.approved_at IS NOT NULL THEN f.id END) AS approved_folder_count,
          MIN(s.date_asset_taken) AS overall_min_date_asset_taken,
          MAX(s.date_asset_taken) AS overall_max_date_asset_taken
      FROM 
          folders f
      JOIN 
          specimen s ON f.id = s.folder_id
      WHERE 
          f.session_started_at IS NOT NULL
      GROUP BY 
          f.session_started_at
    ) AS aggregated_data, (SELECT @row_number:=0) AS temp
    ORDER BY 
      overall_min_date_asset_taken;
    `

  res.json({
    result: sessions,
  })
}
