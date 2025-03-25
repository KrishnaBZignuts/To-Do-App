import { NextResponse } from "next/server";
import { auth } from "./lib/firebase";

export function middleware(request) {
  const user = auth.currentUser;
  const protectedRoutes = ["/dashboard", "/tasks"];

  if (protectedRoutes.includes(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
