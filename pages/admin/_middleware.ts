import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, origin } = req.nextUrl;
  console.log(pathname);

  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login/?next=${pathname}`);
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(origin + "/");
  }

  return NextResponse.next();
}
