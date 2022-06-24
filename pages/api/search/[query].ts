import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IErrors } from "../../../interfaces";
import { IProductSm } from "../../../interfaces/products";
import { Product } from "../../../models";
type DataRes = IErrors | IProductSm[];

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return search(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const search = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const query: string = req.query.query as any;
  await db.connect();
  let products = await Product.find({
    $text: { $search: query.toLowerCase() },
  })
    .select("title images price inStock slug -_id")
    .lean();

  products = products.map((product) => ({
    ...product,
    images: product.images.map((img) => (img.includes("http") ? img : `${process.env.HOST_NAME}/products/${img}`)),
  }));
  await db.disconnect();
  return res.status(200).json(products);
};
