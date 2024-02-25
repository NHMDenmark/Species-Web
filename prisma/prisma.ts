import { PrismaClient, Prisma } from '@prisma/client'

let prisma: PrismaClient
prisma = new PrismaClient()

const folderWithVersions = Prisma.validator<Prisma.FolderArgs>()({
  include: { folder_versions: true },
})
export type FolderWithVersions = Prisma.FolderGetPayload<typeof folderWithVersions>

export { prisma }
