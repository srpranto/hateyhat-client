"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export const GOOGLE_LOGIN_KEY = "hateyhat_google_login_pending";

export function SocialLoginToast() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session && typeof window !== "undefined") {
      const isPending = sessionStorage.getItem(GOOGLE_LOGIN_KEY);
      if (isPending) {
        sessionStorage.removeItem(GOOGLE_LOGIN_KEY);
        toast.success("Logged in successfully.");
      }
    }
  }, [session]);

  return null;
}
