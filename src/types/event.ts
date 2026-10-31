import type { EventType } from "@/lib/constants";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  thumbnail: string;
  eventType: EventType;
  eventDate: string;
  creatorEmail: string;
  createdAt: string;
}

export interface JoinedEventItem {
  _id: string;
  eventId: string;
  eventTitle: string;
  userEmail: string;
  userName?: string;
  joinedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  thumbnail: string;
  eventType: EventType;
  eventDate: string;
}

export interface EventFormErrors {
  title?: string;
  description?: string;
  location?: string;
  thumbnail?: string;
  eventType?: string;
  eventDate?: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  photoURL?: string;
  password?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface ProfileFormErrors {
  name?: string;
  photoURL?: string;
}
