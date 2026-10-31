export const SITE_NAME = "HateyHat";

export const SITE_TAGLINE = "হাতে হাত — hand in hand";

export const SITE_DESCRIPTION = "Community-driven social development events across Dhaka. Show up for your neighbourhood.";

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Distribution",
  "Blood Donation",
  "Health Camp",
  "Education",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}
