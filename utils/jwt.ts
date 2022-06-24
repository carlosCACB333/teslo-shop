import jwt from "jsonwebtoken";

export const signToken = (_id: string) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  if (!jwtKey) {
    throw new Error("No se econtró la llave para firmar el jwt");
  }

  return jwt.sign({ _id }, jwtKey, { expiresIn: "1d" });
};

export const isValidToken = (token: string): Promise<string> => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  if (!jwtKey) {
    throw new Error("No se econtró la llave para firmar el jwt");
  }
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, jwtKey, (err, payload) => {
        if (err) return reject("Token no válido");
        const { _id } = payload as { _id: string };
        return resolve(_id);
      });
    } catch (error) {
      return reject("Token no válido");
    }
  });
};
