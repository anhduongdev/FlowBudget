import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";

const AUTH_ONLY_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (AUTH_ONLY_ROUTES.includes(pathname)) {
    const userId = await getSessionUserId();
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
