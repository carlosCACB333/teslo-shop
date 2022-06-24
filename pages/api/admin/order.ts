import { db } from "database";
import { IErrors, IOrder } from "interfaces";
import { Order, User } from "models";
import type { NextApiRequest, NextApiResponse } from "next";

type DataRes = IErrors | IOrder[];

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  await db.connect();
  const orders = await Order.find().sort({ createdAt: "desc" }).populate("user").lean();

  await db.disconnect();
  return res.status(200).json(orders);
};
