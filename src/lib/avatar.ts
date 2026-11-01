export function getDefaultAvatar(name = "User"): string {
  const clean = name.trim();
  const initial = (clean.length > 0 ? clean.charAt(0) : "U").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="%23047857"/><text x="50%" y="54%" font-family="system-ui,-apple-system,sans-serif" font-size="40" font-weight="700" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
