import formidable from "formidable";
import fs from "fs";
import prisma from "../../prisma/prisma";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    await saveFile(files.file)

    await prisma.cover.create({
      data: {
        image: fields.image_cover,
        label: fields.image_label,
        ocr_read_json: fields.ocr_read_json,
        area: fields.area,
        family: fields.family,
        genus: fields.genus,
        species: fields.species,
        variety: fields.variety,
        subsp: fields.subsp,
        gbif_match_json: fields.gbif_match_json,
        highest_classification: fields.highest_classification,
        flagged: Boolean(fields.flagged),
        approved: Boolean(fields.approved)
      }
    })

    return res.status(201).send("")
  });
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.path)
  fs.writeFileSync(`./public/${file.name}`, data)
  await fs.unlinkSync(file.path)
  return
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
        ? console.log("DELETE")
        : req.method === "GET"
          ? console.log("GET")
          : res.status(404).send("")
};
