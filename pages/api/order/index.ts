import { db } from "database";
import { IErrors, IOrder } from "interfaces";
import { Order, Product } from "models";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { calcSummary } from "../../../utils/utils";
import { IUser } from "../../../interfaces/users";
import { IOrderItem } from "../../../interfaces/products";
type DataRes = IErrors | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const { orderItem, address } = req.body as IOrder;

  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ errors: { notField: "No se encutra autenticado" } });
  }

  //   obtenemos el uid del user
  const uid = session.user?._id as any;

  // obtenemos los productos
  const productIds = orderItem.map((item) => item._id);
  await db.connect();
  const products = await Product.find({ _id: { $in: productIds } });
  console.log(products);

  const items: IOrderItem[] = orderItem.map((prod) => {
    const current = products.find((p) => p.id === prod._id);
    return { ...prod, price: current!.price };
  });
  const summary = calcSummary(items);

  //   creamos la orden
  const order = new Order({ user: uid, orderItem: items, address: address, ...summary });
  await order.save();
  await db.disconnect();

  return res.status(200).json(order);
};
