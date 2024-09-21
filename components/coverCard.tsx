import type { FolderVersion } from '@prisma/client'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  FaArrowRight,
  FaHistory,
  FaRegCheckCircle,
  FaRegSave,
  FaRegTimesCircle,
  FaUndo,
} from 'react-icons/fa'
import Modal from 'react-modal'
import formatTime from '../functions/formatTime'
import gbifNameLookup from '../functions/gbifNameLookup'
import stringToColor from '../functions/stringToColor'
import { FolderWithVersions } from '../prisma/prisma'
import styles from './coverCard.module.css'

const isEqual = require('lodash.isequal')

const areaList = [
  'Fennoscandia',
  'Dania',
  'Grønland',
  'Europa',
  'Africa',
  'Asia',
  'Australia et Oceania',
  'America septentrionalis',
  'America centralis et australis et Antarctica',
  'Loco ignoto vel cult.',
]

const classifications = ['family', 'genus', 'species', 'variety', 'subsp']
const versionFields = ['area', ...classifications]

export default function CoverCard({
  folder,
  index,
  total,
}: {
  folder: FolderWithVersions
  index: number
  total: number
}) {
  const { data: session } = useSession()
  const [areaCorrect, setAreaCorrect] = useState<boolean>(
    folder.folder_versions[0].area ? areaList.includes(folder.folder_versions[0].area) : false
  )
  const [folderState, setFolderState] = useState<FolderWithVersions>(folder)
  const [updates, setUpdates] = useState<FolderVersion | any>(folder.folder_versions[0])
  const [approvedUpdate, setApprovedUpdate] = useState<boolean>(folder.approved_at ? true : false)
  const [toggleBinary, setToggleBinary] = useState<boolean>(true)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const session_start = folder.session_started_at
    ? DateTime.fromISO(folder.session_started_at?.toString())
        .toUTC()
        .toISO()
        ?.replace('T', '_')
        .split('.')[0]
    : undefined

  let versionDiff = !isEqual(
    { ...folderState.folder_versions[0], created_at: '', created_by: '', gbif_match_json: '' },
    { ...updates, created_at: '', created_by: '', gbif_match_json: '' }
  )

  let approvedDiff = approvedUpdate !== (folderState.approved_at ? true : false)

  console.log('versionDiff', versionDiff)
  console.log('approvedDiff', approvedDiff)

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset'
  }, [modalOpen])

  async function updateVersion() {
    return await fetch('/api/folder_versions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updates,
      } as FolderVersion),
    })
  }

  async function approveFolder(approve: boolean = true) {
    return await fetch('/api/folders/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folder_id: folderState.id,
        approve: approve,
      }),
    })
  }

  async function gbifLookup() {
    setUpdates((state: any) => {
      let highestClass = state.highest_classification
      const speciesName = state.species

      let lookupName = ''
      if (highestClass === 'subsp') {
        highestClass = 'subspecies'
        lookupName = `${speciesName} ${state.subsp}`
      } else if (highestClass === 'variety') {
        lookupName = `${speciesName} ${state.variety}`
      } else if (highestClass === 'species') {
        lookupName = speciesName
      } else if (highestClass === 'genus') {
        lookupName = state.genus
      } else if (highestClass === 'family') {
        lookupName = state.family
      }
      gbifNameLookup(lookupName.toLowerCase(), highestClass).then((res) => {
        setUpdates((state: any) => ({ ...state, gbif_match_json: JSON.stringify(res) }))
      })
      return { ...state }
    })
  }

  async function saveChanges() {
    if (versionDiff) {
      const res = await updateVersion()
      if (res.ok) {
        const data = await res.json()
        setFolderState((state) => ({
          ...state,
          folder_versions: [
            { ...updates, created_at: data.created_at, created_by: data.created_by },
            ...state.folder_versions,
          ],
        }))
      }
    }
    if (approvedDiff && approvedUpdate) {
      const res = await approveFolder()
      if (res.ok) {
        const data = await res.json()
        setFolderState((state) => ({
          ...state,
          approved_at: data.approved_at,
          approved_by: data.approved_by,
        }))
      }
    }
  }

  function Classification({ name }: { name: string }) {
    const color =
      name === updates.highest_classification
        ? updates[name].toLowerCase() === JSON.parse(updates.gbif_match_json)?.[name]?.toLowerCase()
          ? 'equal'
          : 'error'
        : ''
    return (
      <>
        <th className={color}>{name[0].toUpperCase() + name.slice(1)}</th>
        <td className={color}>
          <input
            disabled={folderState.approved_at ? true : false}
            className={folderState.approved_at ? '' : color}
            name={name}
            defaultValue={updates[name] ? updates[name] : ''}
            onBlur={(e) => {
              const newUpdates = {
                ...updates,
                [e.target.name]: e.target.value,
              }
              let highestClass = updates.highest_classification
              for (let index = classifications.length - 1; index >= 0; index--) {
                if (!!newUpdates[classifications[index]]) {
                  highestClass = classifications[index]
                  break
                }
              }
              setUpdates((state: any) => ({
                ...state,
                [e.target.name]: e.target.value,
                highest_classification: highestClass,
              }))
              gbifLookup()
            }}
            onKeyDown={(e) => e.key === 'Enter' && (document.activeElement as HTMLElement).blur()}
            autoComplete="off"
            spellCheck="false"
          />
        </td>
        <td className={'gbif ' + color}>{JSON.parse(updates.gbif_match_json)?.[name]}</td>
      </>
    )
  }

  return (
    <div className="card-container">
      <div className="card-top">
        <h4>{folderState.id}</h4>
        {folderState.approved_at ? (
          <div>
            Approved by&nbsp;
            <span
              style={{
                backgroundColor: stringToColor(folderState.approved_by),
                color: 'whitesmoke',
                padding: 3,
                paddingInline: 10,
                borderRadius: '.5rem',
              }}
            >
              {folderState.approved_by}
            </span>{' '}
            {formatTime(folderState.approved_at)}
            {folderState.approved_by === session?.user?.email && (
              <button
                onClick={() => {
                  approveFolder(false).then(() => {
                    setApprovedUpdate(false)
                    setFolderState((state) => ({
                      ...state,
                      approved_at: null,
                      approved_by: null,
                    }))
                  })
                }}
              >
                <FaUndo style={{ display: 'inline', marginLeft: 14, color: '#d93535' }} />
              </button>
            )}
          </div>
        ) : (
          <button
            className={`${styles.verifyButton} ${
              approvedUpdate ? styles.verifyButtonApproved : ''
            }`}
            onClick={() => setApprovedUpdate(!approvedUpdate)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {approvedUpdate ? (
                <>
                  <FaRegCheckCircle fontSize={19} style={{ marginRight: '.5rem' }} /> Approved
                </>
              ) : (
                <>
                  <FaRegTimesCircle fontSize={19} style={{ marginRight: '.5rem' }} /> Not approved
                </>
              )}
            </div>
          </button>
        )}
      </div>
      <div className="card">
        <div className="left">
          <img
            src={`/api/image/${toggleBinary ? 'label_threshold' : 'label'}/${
              session_start ? session_start + '/' : ''
            }${folderState.label}`}
            onClick={() => setToggleBinary(!toggleBinary)}
          />
          <div className="ocr">
            {folderState.ocr_read_json &&
              JSON.parse(folderState.ocr_read_json).map(
                (line: { confidence: number; words: { confidence: number; text: string }[] }) => (
                  <div>{line.words.map((word) => word.text).join(' ')}</div>
                )
              )}
          </div>
        </div>
        <div className="right">
          <table>
            <tr className="top-row">
              <th className={areaCorrect ? 'equal' : 'error'}>Area</th>
              <td className={areaCorrect ? 'equal' : 'error'} colSpan={2}>
                <select
                  disabled={folderState.approved_at ? true : false}
                  className={areaCorrect ? 'equal' : 'error'}
                  defaultValue={
                    folderState.folder_versions[0].area ? folderState.folder_versions[0].area : ''
                  }
                  onChange={(e) => {
                    setUpdates({
                      ...updates,
                      area: e.target.value,
                    })
                    setAreaCorrect(areaList.includes(e.target.value))
                  }}
                >
                  {folderState.folder_versions[0].area &&
                    !areaList.includes(folderState.folder_versions[0].area) && (
                      <option
                        selected
                        disabled
                        value={
                          folderState.folder_versions[0].area
                            ? folderState.folder_versions[0].area
                            : ''
                        }
                      >
                        {folderState.folder_versions[0].area}
                      </option>
                    )}
                  {areaList.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th></th>
              <th className="table-title pt-12 pb-4">Detected</th>
              <th className="table-title pt-12 pb-4">
                GBIF{' '}
                {JSON.parse(updates.gbif_match_json)?.taxonomicStatus &&
                  ['synonym', 'heterotypic_synonym'].includes(
                    JSON.parse(updates.gbif_match_json)?.taxonomicStatus.toLowerCase()
                  ) &&
                  JSON.parse(updates.gbif_match_json)?.acceptedKey && (
                    <a
                      className={styles.tooltipwrap}
                      href={
                        'https://www.gbif.org/species/' +
                        JSON.parse(updates.gbif_match_json)?.acceptedKey?.toString()
                      }
                    >
                      <span
                        //className={styles.tooltipwrap}
                        style={{
                          cursor: 'pointer',
                          position: 'absolute',
                          marginLeft: '20px',
                          marginTop: '-5.5px',
                          fontStyle: 'normal',
                          backgroundColor: '#F3E218',
                          color: 'black',
                          padding: 3,
                          paddingTop: 5,
                          paddingInline: 10,
                          borderRadius: '.5rem',
                        }}
                      >
                        SYNONYM
                      </span>
                      <div className={styles.tooltip}>
                        <div className={styles.tooltiptext}>
                          <div style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
                            Match: {JSON.parse(updates.gbif_match_json)?.scientificName}
                          </div>
                          <div style={{ whiteSpace: 'nowrap', textAlign: 'left' }}>
                            Accepted: {JSON.parse(updates.gbif_match_json)?.accepted}
                          </div>
                        </div>
                      </div>
                    </a>
                  )}
              </th>
            </tr>
            <tr>
              <Classification name="family" />
            </tr>
            <tr>
              <Classification name="genus" />
            </tr>
            <tr>
              <Classification name="species" />
            </tr>
            <tr>
              <Classification name="variety" />
            </tr>
            <tr>
              <Classification name="subsp" />
            </tr>
          </table>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={`${styles.historyButton} ${
            folderState.folder_versions.length == 1 ? styles.hide : ''
          }`}
          onClick={() => {
            setModalOpen(true)
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaHistory fontSize={18} style={{ marginRight: '.5rem' }} /> Revisions:{' '}
            {folderState.folder_versions.length - 1}
          </div>
        </button>
        <button
          className={`${styles.saveButton} ${versionDiff || approvedDiff ? '' : styles.hide}`}
          onClick={saveChanges}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaRegSave fontSize={18} style={{ marginRight: '.5rem' }} /> Save changes
          </div>
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        style={{
          overlay: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
          content: {
            borderRadius: '.5rem',
            padding: '0',
            minWidth: '600px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            margin: 'auto',
            inset: 'auto',
          },
        }}
      >
        <div className={styles.scrollComponent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Revisions</div>
            <button
              className={styles.closeButton}
              onClick={() => {
                setModalOpen(false)
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegTimesCircle fontSize={19} style={{ marginRight: '.5rem' }} /> Close
              </div>
            </button>
          </div>
          <div className={styles.scrollContent}>
            {folderState.folder_versions.slice(1).map((version: FolderVersion, index: number) => {
              const prevVersion = folderState.folder_versions[index + 1] as any
              const currVersion = folderState.folder_versions[index] as any
              return (
                <div className={styles.versionContainer}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginInline: '.7rem',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: stringToColor(currVersion.created_by),
                        color: 'whitesmoke',
                        padding: 3,
                        paddingInline: 10,
                        borderRadius: '.5rem',
                      }}
                    >
                      {currVersion.created_by}
                    </span>
                    {formatTime(currVersion.created_at ?? '')}
                  </div>
                  <div className={styles.version}>
                    <table>
                      {versionFields
                        .filter((field: string) => prevVersion[field] !== currVersion[field])
                        .map((field: string) => (
                          <tr>
                            <th>{field[0].toUpperCase() + field.slice(1)}</th>
                            <td>{prevVersion[field]}</td>
                            <td>
                              <FaArrowRight fontSize={10} style={{ lineHeight: 0 }} />
                            </td>
                            <td>{currVersion[field]}</td>
                          </tr>
                        ))}
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
