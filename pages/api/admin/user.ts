import { db } from "database";
import { IErrors, IUser } from "interfaces";
import { User } from "models";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { IRole } from "../../../interfaces/users";
import { allowedRoles } from "../../../database/constant";
type DataRes = IErrors | IUser[] | IUser;

export default function handler(req: NextApiRequest, res: NextApiResponse<DataRes>) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);

    case "PUT":
      return updateUSer(req, res);
    default:
      return res.status(400).json({ errors: { notField: "Método no definido" } });
  }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  await db.connect();
  const users = await User.find().lean();
  await db.disconnect();
  return res.status(200).json(users);
};

const updateUSer = async (req: NextApiRequest, res: NextApiResponse<DataRes>) => {
  const { uid, role } = req.body as { uid: string; role: IRole };

  if (!isValidObjectId(uid)) {
    return res.status(400).json({ errors: { notField: "El usuario no existe" } });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ errors: { notField: "Rol inválido" } });
  }

  await db.connect();
  const user = await User.findById(uid);
  if (!user) {
    await db.disconnect();
    return res.status(400).json({ errors: { notField: "El usuario no existe" } });
  }

  user.role = role;
  await user.save();
  await db.disconnect();

  return res.status(200).json(user);
};
