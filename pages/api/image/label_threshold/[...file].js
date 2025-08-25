import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { file } = req.query

  try {
  //  const filePath = path.join('./image/label_threshold', file[0], file[1])
  // Construct the file path using the provided timestamp and filename
  const filePath = path.join(process.cwd(), 'image', 'label_threshold', file[0], file[1]) 
  
  fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.status(404).json({ error: 'File not found' })
          return
        } else {
          res.status(500).json({ error: 'Failed to read file' })
          return
        }
      } else {
        res.status(200).send(data)
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file' })
  }
}
