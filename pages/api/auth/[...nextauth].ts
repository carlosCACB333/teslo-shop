import { userdb } from "database";
import nextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { IUser } from "../../../interfaces/users";
export default nextAuth({
  providers: [
    Credentials({
      name: "custom login",
      credentials: {
        email: { type: "email", label: "Correo", placeholder: "ejmplo23@gmail.com" },
        password: { type: "password", label: "Contraseña", placeholder: "*********" },
      },
      async authorize(credencials) {
        if (!credencials?.email || !credencials?.password) return null;
        return await userdb.checkEmailPassword(credencials.email, credencials.password);
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  pages: { signIn: "/auth/login", newUser: "/auth/signup" },
  session: {
    maxAge: 2592000,
    strategy: "jwt",
    updateAge: 86400,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "oauth":
            // con redes sociales
            token.user = await userdb.oAuthToUser(user?.email!, user?.name!, user?.image!);
            break;

          case "credentials":
            // login personalizada
            token.user = user as any;
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
