import { useEffect, useState } from 'react'
import CoverCard from '../components/coverCard'
import Layout from '../components/layout'
import Pagination from '../components/pagination'
import type { PaginationMeta } from '../types/PaginationMeta'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import FoldersLoading from '../components/foldersLoading'
import { FolderWithVersions } from '../prisma/prisma'
import { DateRange } from 'react-day-picker'
import { Session } from '../model/Session'
import Select from 'react-select'
import { Button } from '../@/components/ui/button'
import { BoxIcon, ClipboardCheck } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../@/components/ui/tooltip'

export default function FoldersPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const sessionsParam = searchParams.get('sessions')
  const approved = searchParams.get('approved')

  const [meta, setMeta] = useState<PaginationMeta>()
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [searchDate, setSearchDate] = useState<DateRange | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [perPage, setPerPage] = useState<number>(10)
  const [folders, setFolders] = useState<FolderWithVersions[]>([])
  const [currentPage, setCurrentPage] = useState<number>()

  const [sessions, setSessions] = useState<Session[]>()
  const [viewApproved, setViewApproved] = useState<boolean>(false)
  const [selectedSessions, setSelectedSessions] = useState<Session[]>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      const json = await res.json()
      setSessions(json.result.reverse())
    }
    setLoading(true)
    fetchData().then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page))
    } else {
      setCurrentPage(1)
    }
  }, [page])

  useEffect(() => {
    if (date) return
    if (from) {
      setDate({ from: new Date(from), to: to ? new Date(to) : undefined })
      if (to) {
        setSearchDate({ from: new Date(from), to: new Date(to) })
      }
    }
  }, [from, to])

  useEffect(() => {
    if (sessions) {
      if (sessionsParam) {
        setSelectedSessions(
          sessions?.filter((session) =>
            sessionsParam.split(',').includes(session.overall_min_date_asset_taken.split('T')[0])
          )
        )
      } else if (sessionsParam === null) {
        setSelectedSessions(
          sessions.filter((session) => session.folder_count !== session.approved_folder_count)
        )
      } else if (sessionsParam === '') {
        setSelectedSessions([])
      }
    }
  }, [sessionsParam, sessions])

  useEffect(() => {
    setViewApproved(approved === 'true')
  }, [approved])

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
          from: searchDate?.from?.toDateString(),
          to: searchDate?.to?.toDateString(),
          sessions: selectedSessions?.map((session) => session.session_start),
          onlyNonApproved: !viewApproved,
        }),
      })
      const json = await res.json()
      setMeta(json.meta)
      setFolders(json.result)
    }
    if (selectedSessions !== undefined) {
      setLoading(true)
      setFolders([])
      fetchData().then(() => {
        setLoading(false)
      })
    }
  }, [currentPage, searchDate, selectedSessions, viewApproved])

  function updatePerPage(perPage: number) {
    setCurrentPage(1)
    setPerPage(perPage)
  }

  function updateCurrentPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(pathname + '?' + params.toString(), undefined, { shallow: true })
  }

  /* const defaultDateSelection = date?.from && date?.to ? date.from : undefined

  const defaultDate = new Date()
  defaultDate.setMonth(defaultDate.getMonth() - 2)

  const onDateSelect = (date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('from', date?.from ? date.from.toDateString() : '')
    params.set('to', date?.to ? date.to.toDateString() : '')
    router.push(pathname + '?' + params.toString(), undefined, { shallow: true })
    setDate(date)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      let newSearchDate = undefined
      if (date?.from && date?.to) {
        newSearchDate = date
      }

      if (!isEqual(searchDate, newSearchDate)) {
        setCurrentPage(1)
        setSearchDate(newSearchDate)
      }
    }
  } */

  return (
    <Layout title="Folders">
      {/* <div className="full-w flex justify-center items-center">
        <Popover onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Select session range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              defaultMonth={defaultDateSelection ?? defaultDate}
              toDate={new Date()}
              selected={date}
              onSelect={onDateSelect}
              numberOfMonths={3}
              weekStartsOn={1}
            />
          </PopoverContent>
        </Popover>
      </div> */}
      {sessions && sessions.length > 0 && (
        <div className="mt-4 flex items-end">
          <div className="w-full">
            <Select
              isSearchable
              placeholder="Select sessions..."
              isMulti
              closeMenuOnSelect={false}
              getOptionValue={(option) => option.overall_min_date_asset_taken.split('T')[0]}
              options={sessions}
              formatOptionLabel={(option) => (
                <>
                  <div className="flex align-center">
                    <div className="text-lg">&nbsp;{option.session_index}&nbsp;&nbsp;</div>
                    <div>
                      <div className="font-bold text-xs">
                        {option.overall_min_date_asset_taken.split('T')[0]}
                      </div>
                      <div className=" text-xs">{option.folder_count} folders</div>
                    </div>
                  </div>
                </>
              )}
              styles={{
                valueContainer: (base) => ({
                  ...base,
                  minHeight: '3rem',
                }),
                multiValueLabel: (base, props) => ({
                  ...base,
                  backgroundColor:
                    props.data.folder_count === props.data.approved_folder_count
                      ? 'rgb(178, 250, 173)'
                      : 'rgb(251, 255, 126)',
                  color: 'black',
                }),
                multiValue: (base, props) => ({
                  ...base,
                  backgroundColor:
                    props.data.folder_count === props.data.approved_folder_count
                      ? 'rgb(178, 250, 173)'
                      : 'rgb(251, 255, 126)',
                  color: 'black',
                }),
                multiValueRemove: (base, props) => ({
                  ...base,
                  width: '1.6rem',
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor:
                    props.data.folder_count === props.data.approved_folder_count
                      ? 'rgb(178, 250, 173)'
                      : 'rgb(251, 255, 126)',
                  color: 'black',
                  ':hover': {
                    backgroundColor:
                      props.data.folder_count === props.data.approved_folder_count
                        ? 'rgb(170, 240, 165)'
                        : 'rgb(245, 245, 115)',
                    color: 'black',
                  },
                }),
                option: (base, props) => ({
                  ...base,
                  backgroundColor:
                    props.data.folder_count === props.data.approved_folder_count
                      ? props.isFocused
                        ? 'rgb(170, 240, 165)'
                        : 'rgb(178, 250, 173)'
                      : props.isFocused
                      ? 'rgb(245, 245, 115)'
                      : 'rgb(251, 255, 126)',
                  color: 'black',
                  ':hover': {
                    backgroundColor:
                      props.data.folder_count === props.data.approved_folder_count
                        ? 'rgb(170, 240, 165)'
                        : 'rgb(245, 245, 115)',
                    color: 'black',
                  },
                }),
              }}
              value={selectedSessions}
              onChange={(selected) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set(
                  'sessions',
                  selected
                    .map((session) => session.overall_min_date_asset_taken.split('T')[0])
                    .join(',')
                )
                params.set('page', '1')
                router.push(pathname + '?' + params.toString(), undefined, { shallow: false })
                setSelectedSessions([...selected])
              }}
            />
          </div>
          <div className="ml-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className={`min-h-[50px] rounded border border-solid border-neutral-300 bg-neutral-100 hover:bg-neutral-100 text-neutral-400 hover:text-green-500 hover:border-green-500 ${
                      viewApproved
                        ? 'bg-green-500 hover:bg-green-500 text-white hover:text-white border-green-500'
                        : ''
                    }`}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('approved', Boolean(!viewApproved).toString())
                      params.set('page', '1')
                      router.push(pathname + '?' + params.toString(), undefined, { shallow: false })
                      setViewApproved(!viewApproved)
                    }}
                  >
                    <ClipboardCheck />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Include approved folders</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
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
                top: 235,
                behavior: 'auto',
              })
            }}
          />
        </div>
      )}
    </Layout>
  )
}
