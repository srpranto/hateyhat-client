import { authClient } from "./auth-client";

interface TokenPayload {
  token?: string;
}

export async function getToken(): Promise<string | null> {
  try {
    const res = await authClient.token();
    if (res && res.data && typeof res.data.token === "string" && res.data.token.length > 0) {
      return res.data.token;
    }
  } catch {
  }

  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const parsed: TokenPayload | null = await response.json();
      if (parsed && typeof parsed.token === "string" && parsed.token.length > 0) {
        return parsed.token;
      }
    }
  } catch {
  }

  return null;
}
