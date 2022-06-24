import { db } from "database";
import { User } from "models";
import { compareSync } from "bcryptjs";

export const checkEmailPassword = async (email: string, password: string) => {
  await db.connect();
  const user = await User.findOne({ email }).select("+password").lean();
  await db.disconnect();

  if (!user) return null;
  if (!compareSync(password, user?.password || "")) return null;
  delete user.password;
  return user;
};

export const oAuthToUser = async (email: string, name: string, image: string) => {
  await db.connect();
  let user = await User.findOne({ email });
  if (!user) {
    const user = new User({ email, name, image });
    await user.save();
    await db.disconnect();
    return user;
  }

  await db.disconnect();
  return user;
};
