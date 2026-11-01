import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { normalizeCookieHeader } from "@/lib/cookie-helper";
import type { ReactNode } from "react";

function isNextRedirectError(err: unknown): boolean {
  if (err instanceof Error && err.message === "NEXT_REDIRECT") {
    return true;
  }
  if (typeof err === "object" && err !== null && "digest" in err) {
    const val = Reflect.get(err, "digest");
    return typeof val === "string" && val.startsWith("NEXT_REDIRECT");
  }
  return false;
}

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const reqHeaders = await headers();
  const rawCookie = reqHeaders.get("cookie");
  const normalized = normalizeCookieHeader(rawCookie);
  const forwardHeaders = new Headers(reqHeaders);
  if (normalized) {
    forwardHeaders.set("cookie", normalized);
  }

  let session = null;

  try {
    session = await auth.api.getSession({
      headers: forwardHeaders,
    });
  } catch (err) {
    if (isNextRedirectError(err)) {
      throw err;
    }
    session = null;
  }

  if (!session) {
    const target = reqHeaders.get("x-pathname");
    if (
      target &&
      target.startsWith("/") &&
      !target.startsWith("/login") &&
      !target.startsWith("/register")
    ) {
      redirect(`/login?redirect=${encodeURIComponent(target)}`);
    }
    redirect("/login");
  }

  return <>{children}</>;
}
