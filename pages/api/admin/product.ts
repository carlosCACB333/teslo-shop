import { IErrors } from "interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "database";
import { Product } from "models";
import { IProduct } from "../../../interfaces/products";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL!);

type DataRes = IErrors | IProduct[] | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);

    case "POST":
      return createProduct(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  await db.connect();
  let products = await Product.find().sort({ title: "asc" }).lean();

  products = products.map((product) => ({
    ...product,
    images: product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`)),
  }));
  await db.disconnect();

  return res.status(200).json(products);
};

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const { _id, images } = req.body as IProduct;
  if (!isValidObjectId(_id)) return res.status(400).json({ errors: { notField: "El id no es válido" } });
  if (images.length < 2) return res.status(400).json({ errors: { notField: "Es necesario al menos 2 imágenes" } });

  await db.connect();

  // Product.findOneAndUpdate({ _id }, { $set: req.body }, { new: true }, function (err, product) {
  //   db.disconnect();
  //   if (err) {
  //     return res.status(400).json({ errors: { notField: "No se pudo actualizar el producto" } });
  //   } else {
  //     return res.status(200).json(product!);
  //   }
  // });

  const product = await Product.findById(_id);
  if (!product) {
    await db.disconnect();
    return res.status(400).json({ errors: { notField: "No existe el producto" } });
  }

  product.images.forEach(async (i) => {
    if (!images.includes(i)) {
      const [id, _] = i.substring(i.lastIndexOf("/" + 1)).split(".");
      await cloudinary.uploader.destroy(id);
    }
  });

  await product.update(req.body, { new: true });
  await db.disconnect();
  return res.status(200).json(product);
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) return res.status(400).json({ errors: { notField: "Es necesario al menor 2 imágenes" } });

  try {
    await db.connect();
    const product = new Product(req.body);
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: { notField: "Error al crear el producto" } });
  } finally {
    db.disconnect();
  }
};
