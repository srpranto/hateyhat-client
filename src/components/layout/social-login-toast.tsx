"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export const GOOGLE_LOGIN_KEY = "hateyhat_google_login_pending";
export const AUTH_TOAST_KEY = "hateyhat_auth_toast";

export function SocialLoginToast() {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pendingToast = sessionStorage.getItem(AUTH_TOAST_KEY);
    if (pendingToast) {
      sessionStorage.removeItem(AUTH_TOAST_KEY);
      toast.success(pendingToast);
    }

    if (session) {
      const isGooglePending = sessionStorage.getItem(GOOGLE_LOGIN_KEY);
      if (isGooglePending) {
        sessionStorage.removeItem(GOOGLE_LOGIN_KEY);
        toast.success("Welcome back! Signed in with Google.");
      }
    }
  }, [session]);

  return null;
}
