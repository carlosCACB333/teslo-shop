import { IErrors } from "interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL!);

type DataRes = IErrors | { url: string };

export const config = {
  api: { bodyParser: false },
};

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "POST":
      return uploadImageProduct(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const uploadImageProduct = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const url = await parseFile(req);
  return res.status(200).json({ url });
};

const parseFile = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      //   saveFileOnFileSystem(files.file);
      const url = await saveFileInCloudinary(files.file);
      return resolve(url);
    });
  });
};

function saveFileOnFileSystem(file: formidable.File | formidable.File[]) {
  if (!Array.isArray(file)) {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/${file.originalFilename}`, data);
    fs.unlinkSync(file.filepath);
  }
}
const saveFileInCloudinary = async (file: formidable.File | formidable.File[]): Promise<string> => {
  if (!Array.isArray(file)) {
    const { secure_url } = await cloudinary.uploader.upload(file.filepath, { folder: "teslo-shop" });
    return secure_url;
  }
  return "";
};
