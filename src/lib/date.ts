export function getDhakaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getTomorrowDhakaDate(): string {
  const today = getDhakaToday();
  const parts = today.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));
  const tYear = tomorrow.getUTCFullYear();
  const tMonth = String(tomorrow.getUTCMonth() + 1).padStart(2, "0");
  const tDay = String(tomorrow.getUTCDate()).padStart(2, "0");
  return `${tYear}-${tMonth}-${tDay}`;
}

export function isValidDateFormat(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const parts = dateStr.split("-");
  const yearStr = parts[0];
  const monthStr = parts[1];
  const dayStr = parts[2];
  if (!yearStr || !monthStr || !dayStr) {
    return false;
  }
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function isAfterDhakaToday(dateStr: string): boolean {
  const today = getDhakaToday();
  return dateStr > today;
}

export function isUpcomingDhakaDate(dateStr: string): boolean {
  const today = getDhakaToday();
  return dateStr >= today;
}

export function formatEventDate(dateStr: string): string {
  if (!isValidDateFormat(dateStr)) {
    return dateStr;
  }
  const parts = dateStr.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
