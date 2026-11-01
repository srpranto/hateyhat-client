import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function hasValidSessionCookie(request: NextRequest): boolean {
  const cookieFromHelper = getSessionCookie(request);
  if (cookieFromHelper) {
    return true;
  }

  const knownCookieNames = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "better_auth.session_token",
    "__Secure-better_auth.session_token",
    "better-auth.session_data",
    "__Secure-better-auth.session_data",
    "better-auth_session_token",
    "__Secure-better-auth_session_token",
  ];

  for (const name of knownCookieNames) {
    const val = request.cookies.get(name)?.value;
    if (val && val.length > 0) {
      return true;
    }
  }

  const allCookies = request.cookies.getAll();
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("session_token") ||
      cookie.name.includes("session_data")
    ) {
      if (cookie.value && cookie.value.length > 0) {
        return true;
      }
    }
  }

  return false;
}

export function proxy(request: NextRequest) {
  const destination = request.nextUrl.pathname + request.nextUrl.search;
  if (!hasValidSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", destination);
    return NextResponse.redirect(loginUrl);
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", destination);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/create-event",
    "/manage-events",
    "/joined-events",
    "/profile",
  ],
};

export const middleware = proxy;
export default proxy;
