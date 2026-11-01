import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { normalizeCookieHeader } from "@/lib/cookie-helper";

const handlers = toNextJsHandler(auth);

function wrapHandler(original: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    const rawCookie = req.headers.get("cookie");
    if (rawCookie) {
      const normalized = normalizeCookieHeader(rawCookie);
      if (normalized !== rawCookie) {
        req.headers.set("cookie", normalized);
      }
    }
    return original(req);
  };
}

export const GET = wrapHandler(handlers.GET);
export const POST = wrapHandler(handlers.POST);
export const PATCH = wrapHandler(handlers.PATCH);
export const PUT = wrapHandler(handlers.PUT);
export const DELETE = wrapHandler(handlers.DELETE);
