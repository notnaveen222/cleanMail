import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/dashboard", "/inbox"];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth", request.nextUrl));
  }
  return NextResponse.next();
}

//config -> seems optional, read thru
