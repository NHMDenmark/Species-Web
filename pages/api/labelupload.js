import formidable from 'formidable'
import fs from 'fs'
import { authenticate } from '../../authentication/api-auth'

export const config = {
  api: {
    bodyParser: false,
  },
}

const post = async (req, res) => {

  // KC authentication
  const user = await authenticate(req, res)
  if (!user) return res.status(401).send('Missing token or invalid token')

  // user now contains KC claims
  console.log('Authenticated user:', user.sub)

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).send('Error parsing form');
    }

    try {
      // Convert session_started_at to UTC
      const localDateTime = fields.session_started_at.replace(' ', 'T'); // Convert to ISO format
      const localDate = new Date(localDateTime); // Parse the local DateTime

      // Format as UTC string: "YYYY-MM-DD_HH:mm:ss"
      const session_start_string = `${localDate.getUTCFullYear()}-${String(localDate.getUTCMonth() + 1).padStart(2, '0')}-${String(localDate.getUTCDate()).padStart(2, '0')}_` +
                                   `${String(localDate.getUTCHours()).padStart(2, '0')}:${String(localDate.getUTCMinutes()).padStart(2, '0')}:${String(localDate.getUTCSeconds()).padStart(2, '0')}`;

      // Save files in UTC-based folder
      await saveFile(`./image/label/${session_start_string}/`, files.label);
      await saveFile(`./image/label_threshold/${session_start_string}/`, files.label_threshold);

      return res.status(201).send('Done');
    } catch (error) {
      console.error('Error processing files:', error);
      return res.status(500).send('Error processing files');
    }
  });
};

const saveFile = async (folder, file) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const data = fs.readFileSync(file.path);
  fs.writeFileSync(`${folder}${file.name}`, data);
  await fs.unlinkSync(file.path);
};

export default (req, res) => {
  if (req.method === 'POST') {
    return post(req, res);
  } else if (req.method === 'PUT') {
    console.log('PUT');
  } else if (req.method === 'DELETE') {
    console.log('DELETE');
  } else if (req.method === 'GET') {
    console.log('GET');
  } else {
    return res.status(404).send('');
  }
};