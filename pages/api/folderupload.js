import formidable from 'formidable'
import fs from 'fs'
import { prisma } from '../../prisma/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

const post = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    try {
      const session_start_string = fields.session_started_at.replace(' ', '_')
      await saveFile(`./image/label/${session_start_string}/`, files.label)
      await saveFile(`./image/label_threshold/${session_start_string}/`, files.label_threshold)

      const folder = await prisma.folder.create({
        data: {
          image: fields.image_cover,
          label: fields.image_label,
          ocr_read_json: fields.ocr_read_json,
          flagged: Boolean(fields.flagged),
          session_started_at: new Date(fields.session_started_at),
        },
      })

      await prisma.folderVersion.create({
        data: {
          area: fields.area,
          family: fields.family,
          genus: fields.genus,
          species: fields.species,
          variety: fields.variety,
          subsp: fields.subsp,
          gbif_match_json: fields.gbif_match_json,
          highest_classification: fields.highest_classification,
          folder_id: folder.id,
        },
      })

      if (fields.specimen && fields.specimen.length > 0) {
        await prisma.specimen.createMany({
          data: [
            ...fields.specimen.map((specimen) => ({
              guid: specimen.guid,
              digitiser: specimen.digitiser,
              date_asset_taken: specimen.date_asset_taken,
              image_file: specimen.image_file,
              checksum: specimen.checksum,
              folder_id: folder.id,
            })),
          ],
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }

    return res.status(201).send('')
  })
}

const saveFile = async (folder, file) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }

  const data = fs.readFileSync(file.path)
  fs.writeFileSync(`${folder}${file.name}`, data)
  await fs.unlinkSync(file.path)
  return
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
