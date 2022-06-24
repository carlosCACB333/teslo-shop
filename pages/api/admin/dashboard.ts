import { db } from "database";
import { IDashboard, IErrors } from "interfaces";
import { Order, Product, User } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
type DataRes = IErrors | IDashboard;

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return getStats(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const getStats = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  await db.connect();
  const [numberOfOrders, numberOfClients, numberOfProducts, paidOrdes, lowInventory, productsWhitNotInventory] = await Promise.all([
    Order.count(),
    User.find({ role: "client" }).count(),
    Product.count(),
    Order.find({ isPaid: true }).count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);
  db.disconnect();

  return res.status(200).json({
    numberOfOrders,
    numberOfClients,
    numberOfProducts,
    paidOrdes,
    notPaidOrders: numberOfOrders - paidOrdes,
    lowInventory,
    productsWhitNotInventory,
  });
};
