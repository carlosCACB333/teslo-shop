import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../database";
import { initialData } from "../../database/seed-data";
import { Order, Product, User } from "../../models";
type Data = {
  msg: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (process.env.NODE_ENV === "production") {
    return res.status(400).json({ msg: "Este método solo se ejecuta en modo producción" });
  }

  switch (req.method) {
    case "GET":
      await db.connect();

      await User.deleteMany();
      await User.insertMany(initialData.users);

      await Product.deleteMany();
      await Product.insertMany(initialData.products);

      await Order.deleteMany();

      await db.disconnect();
      return res.status(200).json({ msg: "Proceso realizo con éxito" });
    default:
      return res.status(400).json({ msg: "Método no definido" });
  }
}
