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
  if (!trimmedPhoto) {
    errors.photoURL = "Photo URL is required.";
  } else if (!isValidUrl(trimmedPhoto)) {
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
  if (!trimmedPhoto) {
    errors.photoURL = "Photo URL is required.";
  } else if (!isValidUrl(trimmedPhoto)) {
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
  if (!trimmedThumb) {
    errors.thumbnail = "Thumbnail URL is required.";
  } else if (!isValidUrl(trimmedThumb)) {
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
