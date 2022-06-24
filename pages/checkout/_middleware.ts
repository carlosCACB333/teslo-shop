import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ secret: process.env.NEXTAUTH_SECRET, req });
  const { origin, pathname } = req.nextUrl.clone();

  if (!session) return NextResponse.redirect(`${origin}/auth/login?next=${pathname}`);
  return NextResponse.next();
}

// export async function middleware(req: NextRequest, ev: NextFetchEvent) {
//   const { token = "" } = req.cookies;
//   const { origin, pathname } = req.nextUrl.clone();
//   try {
//     const id = await jwt.isValidToken(token);
//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.redirect(`${origin}/auth/login?next=${pathname}`);
//   }
// }
