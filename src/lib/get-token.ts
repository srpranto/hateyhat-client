import { authClient } from "./auth-client";

export async function getToken(): Promise<string | null> {
  try {
    const res = await authClient.token();
    if (res && res.data && typeof res.data.token === "string") {
      return res.data.token;
    }
    return null;
  } catch {
    return null;
  }
}
