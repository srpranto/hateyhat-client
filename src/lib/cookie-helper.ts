export function normalizeCookieHeader(cookieHeader: string | null | undefined): string {
  if (!cookieHeader || typeof cookieHeader !== "string") {
    return "";
  }

  const pairs = cookieHeader.split(";").map((p) => p.trim()).filter(Boolean);
  const map = new Map<string, string>();

  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx > 0) {
      map.set(pair.slice(0, eqIdx), pair.slice(eqIdx + 1));
    }
  }

  const tokenPrefixes = ["better-auth.session_token", "better_auth.session_token"];
  for (const name of tokenPrefixes) {
    const secureName = `__Secure-${name}`;
    const secureVal = map.get(secureName);
    const standardVal = map.get(name);

    if (secureVal !== undefined && standardVal === undefined) {
      map.set(name, secureVal);
    } else if (standardVal !== undefined && secureVal === undefined) {
      map.set(secureName, standardVal);
    }
  }

  const dataPrefixes = ["better-auth.session_data", "better_auth.session_data"];
  for (const name of dataPrefixes) {
    const secureName = `__Secure-${name}`;
    const secureVal = map.get(secureName);
    const standardVal = map.get(name);

    if (secureVal !== undefined && standardVal === undefined) {
      map.set(name, secureVal);
    } else if (standardVal !== undefined && secureVal === undefined) {
      map.set(secureName, standardVal);
    }
  }

  return Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}
