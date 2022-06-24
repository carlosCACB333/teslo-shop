import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IErrors, IProductSm } from "../../../interfaces";
import { Product } from "../../../models";
import { allowedGenres } from "../../../database/constant";
import { IGenres } from "../../../interfaces/products";
type DataRes = IErrors | IProductSm[];

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const gender: IGenres = req.query.gender as any;
  const filters: { gender?: string } = {};
  if (allowedGenres.includes(gender)) {
    filters.gender = gender;
  }

  await db.connect();
  let products = await Product.find(filters).select("title images price inStock slug -_id").lean();
  products = products.map((product) => ({
    ...product,
    images: product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`)),
  }));
  await db.disconnect();
  return res.status(200).json(products);
};
