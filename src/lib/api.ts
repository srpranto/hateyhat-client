import type { EventFormData, EventItem } from "@/types/event";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, options);

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body: unknown = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const errorBody =
        typeof body === "object" && body !== null ? (body as ApiErrorBody) : null;

      const fallbackMsg = res.statusText
        ? `Request failed (${res.status} ${res.statusText}).`
        : "An unexpected error occurred.";

      return {
        ok: false,
        status: res.status,
        message: errorBody?.message || fallbackMsg,
        errors: errorBody?.errors,
      };
    }

    return { ok: true, data: body as T };
  } catch (error) {
    const isNetwork =
      error instanceof TypeError && error.message.toLowerCase().includes("fetch");
    return {
      ok: false,
      status: 0,
      message: isNetwork
        ? "Network error. Failed to connect to server."
        : "An error occurred while connecting to the server.",
    };
  }
}

export async function getEvents(limit?: number): Promise<ApiResult<EventItem[]>> {
  const query = limit ? `?limit=${encodeURIComponent(limit.toString())}` : "";
  return apiFetch<EventItem[]>(`/events${query}`, { cache: "no-store" });
}

export async function getEventById(id: string): Promise<ApiResult<EventItem>> {
  return apiFetch<EventItem>(`/events/${encodeURIComponent(id)}`, { cache: "no-store" });
}

export async function createEvent(
  data: EventFormData,
  token: string
): Promise<ApiResult<{ message: string; eventId: string }>> {
  return apiFetch<{ message: string; eventId: string }>("/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getMyEvents(token: string): Promise<ApiResult<EventItem[]>> {
  return apiFetch<EventItem[]>("/my-events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function updateEvent(
  id: string,
  data: EventFormData,
  token: string
): Promise<ApiResult<{ message: string; event: EventItem }>> {
  return apiFetch<{ message: string; event: EventItem }>(
    `/events/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
}

export async function deleteEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string; deletedId: string }>> {
  return apiFetch<{ message: string; deletedId: string }>(
    `/events/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function joinEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string }>> {
  return apiFetch<{ message: string }>(
    `/events/${encodeURIComponent(id)}/join`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function getJoinedEvents(token: string): Promise<ApiResult<EventItem[]>> {
  return apiFetch<EventItem[]>("/joined-events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function cancelJoinEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string }>> {
  return apiFetch<{ message: string }>(
    `/events/${encodeURIComponent(id)}/join`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

