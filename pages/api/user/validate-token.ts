import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IErrors, IUser } from "../../../interfaces";
import { User } from "../../../models";
import { jwt } from "../../../utils";
type DataRes = IErrors | { user: IUser; token: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) {
  switch (req.method) {
    case "GET":
      return validateToken(req, res);
    default:
      return res
        .status(400)
        .json({ errors: { notField: "Método no definido" } });
  }
}
const validateToken = async (
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) => {
  const token = req.cookies.token as string;
  let _id;
  try {
    _id = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(400).json({ errors: { notField: String(error) } });
  }

  await db.connect();
  const user = await User.findById(_id).lean();
  await db.disconnect();

  if (!user) {
    return res
      .status(400)
      .json({ errors: { notField: "El usuario no existe" } });
  }

  return res.status(200).json({ token: jwt.signToken(user._id!), user });
};
