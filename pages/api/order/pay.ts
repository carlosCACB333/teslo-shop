import axios from "axios";
import { IErrors, IOrder, IPayRes } from "interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { Order } from "models";
import { db } from "database";

type IResp = IErrors | IOrder;
export default function handler(req: NextApiRequest, res: NextApiResponse<IResp>) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}

const getPaypalToken = async (): Promise<string | null> => {
  const paypay_client = process.env.NEXT_PUBLIC_PAYPAL_ID;
  const paypay_secret = process.env.PAYPAL_SECRET;
  const base64token = Buffer.from(`${paypay_client}:${paypay_secret}`, "utf-8").toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");
  try {
    const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL!, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64token}`,
      },
    });

    return data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const payOrder = async (req: NextApiRequest, res: NextApiResponse<IResp>) => {
  const paypalToken = await getPaypalToken();
  const { transactionId, orderId } = req.body;

  const { data } = await axios.get<IPayRes>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
    headers: { Authorization: `Bearer ${paypalToken}` },
  });

  if (data.status !== "COMPLETED") {
    return res.status(400).json({ errors: { notField: "Orden no reconocida" } });
  }

  await db.connect();
  const order = await Order.findById(orderId);

  if (!order) {
    await db.disconnect();
    return res.status(400).json({ errors: { notField: "La órden no existe en la base de datos" } });
  }

  if (order.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res.status(400).json({ errors: { notField: "El total de la orden no coincide con la de paypal " } });
  }

  order.transactionId = transactionId;
  order.isPaid = true;
  order.paidAt = data.create_time;

  await order.save();

  return res.status(200).json(order);
};
