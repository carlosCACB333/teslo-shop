import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ msg: "No autorizado" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
