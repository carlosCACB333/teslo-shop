import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces/products";
import { db } from "database";
import { Order } from "models";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) return null;
  await db.connect();
  const order = await Order.findById(id).lean();
  await db.disconnect();
  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (uid: string): Promise<IOrder[]> => {
  if (!isValidObjectId(uid)) return [];
  await db.connect();
  const orders = await Order.find({ user: uid });
  await db.disconnect();
  return JSON.parse(JSON.stringify(orders));
};
