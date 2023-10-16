import { useEffect, useState } from 'react'
import CoverCard from '../components/coverCard'
import Layout from '../components/layout'
import Pagination from '../components/pagination'
import type { PaginationMeta } from '../types/PaginationMeta'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import FoldersLoading from '../components/foldersLoading'
import { FolderWithVersions } from '../prisma/prisma'

export default function FoldersPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams.get('page')

  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>()
  const [perPage, setPerPage] = useState<number>(10)
  const [meta, setMeta] = useState<PaginationMeta>()
  const [folders, setFolders] = useState<FolderWithVersions[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPage: currentPage,
          perPage: perPage,
        }),
      })
      const json = await res.json()
      setMeta(json.meta)
      setFolders(json.result)
    }
    setLoading(true)
    setFolders([])
    fetchData().then(() => {
      setLoading(false)
    })
  }, [currentPage])

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page))
    } else {
      setCurrentPage(1)
    }
  }, [page])

  function updatePerPage(perPage: number) {
    setCurrentPage(1)
    setPerPage(perPage)
  }

  function updateCurrentPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(pathname + '?' + params.toString(), undefined, { shallow: true })
    setCurrentPage(page)
  }

  return (
    <Layout title="Folders">
      {meta && (
        <div style={{ marginTop: 50, marginBottom: 30 }}>
          <Pagination
            pageCount={meta.pageCount}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
          />
        </div>
      )}
      {loading ? (
        <FoldersLoading />
      ) : (
        <>
          {folders.map((folder, index, list) => (
            <CoverCard
              key={folder.id}
              folder={folder}
              index={(currentPage && currentPage > 1 ? (currentPage - 1) * perPage : 0) + index + 1}
              total={meta ? meta.itemCount : 0}
            />
          ))}
        </>
      )}
      {meta && (
        <div style={{ marginTop: 30, marginBottom: 50 }}>
          <Pagination
            pageCount={meta.pageCount}
            currentPage={currentPage}
            setCurrentPage={(page) => {
              updateCurrentPage(page)
              window.scrollTo({
                top: 170,
                behavior: 'auto',
              })
            }}
          />
        </div>
      )}
    </Layout>
  )
}
