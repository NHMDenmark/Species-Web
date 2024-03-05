import formidable from 'formidable'
import fs from 'fs'

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
