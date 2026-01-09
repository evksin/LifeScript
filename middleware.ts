import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Проверяем наличие токена сессии в cookies
  const sessionToken = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value;
  
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

