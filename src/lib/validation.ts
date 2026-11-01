import { isEventType } from "./constants";
import { isAfterDhakaToday, isValidDateFormat } from "./date";
import type {
  EventFormData,
  EventFormErrors,
  LoginFormErrors,
  ProfileFormErrors,
  RegisterFormErrors,
} from "@/types/event";

export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidImageSrc(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.startsWith("/")) return trimmed.length > 1;
  try {
    const url = new URL(trimmed);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeImageUrl(urlStr: string): string {
  let trimmed = typeof urlStr === "string" ? urlStr.trim() : "";
  if (!trimmed) return "";
  trimmed = trimmed.replace(/^["']|["']$/g, "").trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    if (trimmed.includes(".") || trimmed.startsWith("localhost")) {
      trimmed = `https://${trimmed}`;
    }
  }
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (
      (host === "unsplash.com" || host === "www.unsplash.com") &&
      parsed.pathname.startsWith("/photos/")
    ) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && parts[1] !== "download") {
        const photoIdWithSlug = parts[1];
        if (photoIdWithSlug.startsWith("photo-")) {
          return `https://images.unsplash.com/${photoIdWithSlug}?auto=format&fit=crop&w=1200&q=80`;
        }
        const timestampMatch = photoIdWithSlug.match(/\d{10,}-[a-f0-9]+/i);
        if (timestampMatch) {
          return `https://images.unsplash.com/photo-${timestampMatch[0]}?auto=format&fit=crop&w=1200&q=80`;
        }
        const lastDashIndex = photoIdWithSlug.lastIndexOf("-");
        const photoId = lastDashIndex !== -1 ? photoIdWithSlug.slice(lastDashIndex + 1) : photoIdWithSlug;
        return `https://images.unsplash.com/photo-${encodeURIComponent(photoId)}?auto=format&fit=crop&w=1200&q=80`;
      }
    }
    if (host === "images.unsplash.com" || host === "plus.unsplash.com") {
      parsed.protocol = "https:";
      if (!parsed.searchParams.has("auto")) parsed.searchParams.set("auto", "format");
      if (!parsed.searchParams.has("fit")) parsed.searchParams.set("fit", "crop");
      if (!parsed.searchParams.has("w")) parsed.searchParams.set("w", "1200");
      if (!parsed.searchParams.has("q")) parsed.searchParams.set("q", "80");
      return parsed.toString();
    }
    if (host === "imgur.com" || host === "www.imgur.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const imgId = parts[parts.length - 1];
      if (imgId && /^[a-zA-Z0-9]+$/.test(imgId)) {
        return `https://i.imgur.com/${imgId}.jpg`;
      }
    }
    if (host === "github.com" && parsed.pathname.includes("/blob/")) {
      return trimmed.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}


export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateRegisterInput(data: {
  name: string;
  email: string;
  photoURL: string;
  password: string;
}): { isValid: boolean; errors: RegisterFormErrors } {
  const errors: RegisterFormErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  const trimmedPhoto = data.photoURL.trim();
  const normalizedPhoto = normalizeImageUrl(trimmedPhoto);
  if (trimmedPhoto && !isValidUrl(normalizedPhoto)) {
    errors.photoURL = "Photo URL must be a valid HTTP or HTTPS URL.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must include at least one uppercase letter.";
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = "Password must include at least one lowercase letter.";
  }

  const isValid =
    !errors.name && !errors.email && !errors.photoURL && !errors.password;

  return { isValid, errors };
}

export function validateLoginInput(data: {
  email: string;
  password: string;
}): { isValid: boolean; errors: LoginFormErrors } {
  const errors: LoginFormErrors = {};

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  const isValid = !errors.email && !errors.password;

  return { isValid, errors };
}

export function validateProfileInput(data: {
  name: string;
  photoURL: string;
}): { isValid: boolean; errors: ProfileFormErrors } {
  const errors: ProfileFormErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const trimmedPhoto = data.photoURL.trim();
  const normalizedPhoto = normalizeImageUrl(trimmedPhoto);
  if (trimmedPhoto && !isValidUrl(normalizedPhoto)) {
    errors.photoURL = "Photo URL must be a valid HTTP or HTTPS URL.";
  }

  const isValid = !errors.name && !errors.photoURL;

  return { isValid, errors };
}

export function validateEventFormData(
  data: EventFormData,
  isUpdate = false,
  existingDate?: string
): { isValid: boolean; errors: EventFormErrors } {
  const errors: EventFormErrors = {};

  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) {
    errors.title = "Title is required.";
  } else if (trimmedTitle.length < 5) {
    errors.title = "Title must be at least 5 characters.";
  } else if (trimmedTitle.length > 100) {
    errors.title = "Title must not exceed 100 characters.";
  }

  const trimmedDesc = data.description.trim();
  if (!trimmedDesc) {
    errors.description = "Description is required.";
  } else if (trimmedDesc.length < 20) {
    errors.description = "Description must be at least 20 characters.";
  } else if (trimmedDesc.length > 1000) {
    errors.description = "Description must not exceed 1000 characters.";
  }

  if (!isEventType(data.eventType)) {
    errors.eventType = "Please select a valid event type.";
  }

  const trimmedThumb = data.thumbnail.trim();
  const normalizedThumb = normalizeImageUrl(trimmedThumb);
  if (!trimmedThumb) {
    errors.thumbnail = "Thumbnail URL is required.";
  } else if (!isValidUrl(normalizedThumb)) {
    errors.thumbnail = "Thumbnail must be a valid HTTP or HTTPS URL.";
  }

  const trimmedLoc = data.location.trim();
  if (!trimmedLoc) {
    errors.location = "Location is required.";
  } else if (trimmedLoc.length < 3) {
    errors.location = "Location must be at least 3 characters.";
  } else if (trimmedLoc.length > 120) {
    errors.location = "Location must not exceed 120 characters.";
  }

  const trimmedDate = data.eventDate.trim();
  if (!trimmedDate) {
    errors.eventDate = "Event date is required.";
  } else if (!isValidDateFormat(trimmedDate)) {
    errors.eventDate = "Event date must be a valid date in YYYY-MM-DD format.";
  } else if ((!isUpdate || trimmedDate !== existingDate) && !isAfterDhakaToday(trimmedDate)) {
    errors.eventDate = "Event date must be after today.";
  }

  const isValid =
    !errors.title &&
    !errors.description &&
    !errors.eventType &&
    !errors.thumbnail &&
    !errors.location &&
    !errors.eventDate;

  return { isValid, errors };
}
