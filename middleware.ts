import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // NextAuth v4 использует следующие имена cookies:
  // - next-auth.session-token (для HTTP)
  // - __Secure-next-auth.session-token (для HTTPS)
  // - __Host-next-auth.session-token (для HTTPS с определенными настройками)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("__Host-next-auth.session-token")?.value;

  // Если нет токена сессии, редиректим на /login
  if (!sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-prompts/:path*"],
};
