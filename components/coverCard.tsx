import type { Cover } from '@prisma/client'
import { useState } from 'react'

const areaList = [
    "Fennoscandia",
    "Dania",
    "Grønland",
    "Europa",
    "Africa",
    "Asia",
    "Australia et Oceania",
    "America septentrionalis",
    "America centralis et australis et Antarctica",
    "Loco ignoto vel cult."
]

const classifications = [
    "family",
    "genus",
    "species",
    "variety",
    "subsp"
]

export default function CoverCard({ cover, index, total }: { cover: Cover, index: number, total: number }) {
    const gbifMatch = cover.gbif_match_json ? JSON.parse(cover.gbif_match_json) : null
    const [areaCorrect, setAreaCorrect] = useState<boolean>(cover.area ? areaList.includes(cover.area) : false)
    const [highestClassification, setHighestClassification] = useState<string>(cover.highest_classification ?? "species")
    const [updates, setUpdates] = useState<Cover | any>(cover)
    const [toggleBinary, setToggleBinary] = useState<boolean>(false)
    let update = { ...cover }

    function Classification({ name }: { name: string }) {
        const color = name === highestClassification ? (updates[name].toLowerCase() === gbifMatch?.[name]?.toLowerCase() ? 'equal' : 'error') : ''
        return (
            <>
                <th className={color}>
                    {name[0].toUpperCase() + name.slice(1)}
                </th>
                <td className={color}>
                    <input
                        className={color}
                        name={name}
                        defaultValue={updates[name] ? updates[name] : ""}
                        onBlur={(e) => {
                            const newUpdates = { ...updates, [e.target.name]: e.target.value }
                            setUpdates(newUpdates)
                            for (let index = classifications.length-1; index >= 0; index--) {
                                if (!!newUpdates[classifications[index]]) {
                                    setHighestClassification(classifications[index])
                                    break
                                }
                            }
                        }}
                        autoComplete="off"
                        spellCheck="false"
                    />
                </td>
                <td className={'gbif ' + color}>
                    {gbifMatch?.[name]}
                </td>
            </>
        )
    }

    return (
        <div className="card-container">
            <div className="card-top">
                <h4>
                    {cover.id}
                </h4>
                <h4>
                    {index} of {total}
                </h4>
            </div>
            <div className="card">
                <div className="left">
                    <img src={(toggleBinary ? "api/image/label_threshold/" : "/api/image/label/") + cover.label} onClick={() => setToggleBinary(!toggleBinary)} />
                    <div className="ocr">
                        {cover.ocr_read_json && JSON.parse(cover.ocr_read_json).map((line: { confidence: number, words: { confidence: number, text: string }[] }) => (
                            <div>
                                {line.words.map(word => word.text).join(' ')}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right">
                    <table>
                        <tr className="top-row">
                            <th className={areaCorrect ? 'equal' : 'error'}>
                                Area
                            </th>
                            <td className={areaCorrect ? 'equal' : 'error'} colSpan={2}>
                                <select
                                    className={areaCorrect ? 'equal' : 'error'}
                                    defaultValue={cover.area ? cover.area : ""}
                                    onChange={(e) => {
                                        update = { ...update, area: e.target.value }
                                        setAreaCorrect(areaList.includes(e.target.value))
                                    }}
                                >
                                    {cover.area && !areaList.includes(cover.area) && <option selected disabled value={cover.area ? cover.area : ""} >{cover.area}</option>}
                                    {areaList.map(option => (<option value={option} >{option}</option>))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>

                            </th>
                            <th className="table-title">
                                Detected
                            </th>
                            <th className="table-title">
                                GBIF
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
        </div>
    )
}
