import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product } from "../../../models";
import { IProduct } from "../../../interfaces/products";
import { IErrors } from "../../../interfaces";
type DataRes = IErrors | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);
    default:
      return res
        .status(400)
        .json({ errors: { notField: "Método no definido" } });
  }
}
const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) => {
  const slug: string = req.query.slug as any;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) {
    return res
      .status(400)
      .json({ errors: { notField: "Producto no encontrado" } });
  }
  return res.status(200).json(product);
};
