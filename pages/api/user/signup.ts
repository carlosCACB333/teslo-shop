import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IErrors, IUser } from "../../../interfaces/index";
import { User } from "../../../models";
import { jwt, validations } from "../../../utils";
import bcrypt from "bcryptjs";
type DataRes = IErrors | { token: string; user: IUser };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) {
  switch (req.method) {
    case "POST":
      return signupUser(req, res);
    default:
      return res
        .status(400)
        .json({ errors: { notField: "Método no definido" } });
  }
}
const signupUser = async (
  req: NextApiRequest,
  res: NextApiResponse<DataRes>
) => {
  const { email, password, name } = req.body as {
    email: string;
    password: string;
    name: string;
  };

  if (!email) {
    return res
      .status(400)
      .json({ errors: { email: "Este campo es requerido" } });
  }

  if (!validations.isValidEmail(email)) {
    return res
      .status(400)
      .json({ errors: { email: "Este campo no es un correo válido" } });
  }

  if (!password) {
    return res
      .status(400)
      .json({ errors: { password: "Este campo es requerido" } });
  }

  if (password.length < 6) {
    return res.status(400).json({
      errors: { password: "Este campo debe ser como mínimo 6 caracteres" },
    });
  }

  if (!name) {
    return res
      .status(400)
      .json({ errors: { name: "Este campo es requerido" } });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    await db.disconnect();
    res.status(400).json({ errors: { email: "Ya está registrado" } });
  }

  try {
    const user = new User({ email, name, password: bcrypt.hashSync(password) });
    await user.save({ validateBeforeSave: true });
    await db.disconnect();
    delete user.password;
    const token = jwt.signToken(user._id!);
    return res.status(200).json({ token, user });
  } catch (error) {
    db.disconnect();
    return res.status(500).json({ errors: { notField: "Error inesperado" } });
  }
};
