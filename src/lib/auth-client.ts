import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const appBaseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: appBaseUrl,
  plugins: [
    jwtClient(),
  ],
  fetchOptions: {
    onSuccess: (context) => {
      if (typeof window === "undefined") return;
      const requestUrl =
        (typeof context?.request === "object" && context.request && "url" in context.request
          ? String(context.request.url)
          : "") || "";
      if (
        requestUrl.includes("get-session") ||
        requestUrl.includes("token") ||
        requestUrl.includes("jwks")
      ) {
        return;
      }
      window.dispatchEvent(new Event("auth-session-change"));
    },
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  updateUser,
} = authClient;
