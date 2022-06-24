import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { IErrors, IUser } from "../../../interfaces";
import { jwt } from "../../../utils";

type DataRes =
  | IErrors
  | {
      token: string;
      user: IUser;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);
    default:
      return res
        .status(400)
        .json({ errors: { notField: "Método no definido" } });
  }
}
const loginUser = async (
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ errors: { email: "Este campo es obligatorio" } });
  }
  if (!password) {
    return res
      .status(400)
      .json({ errors: { password: "Este campo es obligatorio" } });
  }

  await db.connect();
  const user = await User.findOne({ email }).select("+password").lean();
  await db.disconnect();

  if (!user) {
    return res
      .status(400)
      .json({ errors: { email: "No existe un usuario con este correo" } });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res
      .status(400)
      .json({ errors: { password: "La contraseña es incorrecta" } });
  }

  delete user.password;

  const token = jwt.signToken(user._id!);

  return res.status(200).json({
    token,
    user,
  });
};
