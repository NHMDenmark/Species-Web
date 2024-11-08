import { prisma } from '../../prisma/prisma'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

const post = async (req, res) => {
  const data = req.body
  console.log(data)
  try {
    const folder = await prisma.folder.create({
      data: {
        image: data.image_cover,
        label: data.image_label,
        ocr_read_json: data.ocr_read_json,
        flagged: Boolean(data.flagged),
        session_started_at: new Date(data.session_started_at),
      },
    })

    await prisma.folderVersion.create({
      data: {
        area: data.area,
        family: data.family,
        genus: data.genus,
        species: data.species,
        variety: data.variety,
        subsp: data.subsp,
        gbif_match_json: data.gbif_match_json,
        highest_classification: data.highest_classification,
        folder_id: folder.id,
      },
    })
    console.log(data.specimen)
    const specimen = data.specimen.map((specimen) => ({
      barcode: specimen.barcode,
      guid: specimen.guid,
      digitiser: specimen.digitiser,
      date_asset_taken: specimen.date_asset_taken,
      image_file: specimen.image_file,
      checksum: specimen.checksum,
      folder_id: folder.id,
    }))
    console.log(specimen)

    if (data.specimen && data.specimen.length > 0) {
      await prisma.specimen.createMany({
        data: specimen,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }

  return res.status(201).send('')
}

export default (req, res) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('')
}
