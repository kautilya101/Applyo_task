import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const verified = token && await verifyJWT(token);
  const { pathname } = req.nextUrl;

  const authPages = ["/sign-in", "/sign-up"];

  if (verified && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!verified && pathname.startsWith("/board")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*", "/sign-in", "/sign-up"],
};
