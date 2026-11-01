import type { EventFormData, EventItem } from "@/types/event";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function getEvents(limit?: number): Promise<ApiResult<EventItem[]>> {
  try {
    const url = limit
      ? `${API_BASE_URL}/events?limit=${encodeURIComponent(limit.toString())}`
      : `${API_BASE_URL}/events`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorJson: { message?: string } | null = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: errorJson?.message || "Failed to fetch events.",
      };
    }
    const data: EventItem[] = await res.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function getEventById(id: string): Promise<ApiResult<EventItem>> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const errorJson: { message?: string } | null = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: errorJson?.message || "Failed to fetch event.",
      };
    }
    const data: EventItem = await res.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function createEvent(
  data: EventFormData,
  token: string
): Promise<ApiResult<{ message: string; eventId: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const body: {
      message?: string;
      eventId?: string;
      errors?: Record<string, string>;
    } | null = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message || "Failed to create event.",
        errors: body?.errors,
      };
    }
    return {
      ok: true,
      data: {
        message: body?.message || "Event created successfully.",
        eventId: body?.eventId || "",
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function getMyEvents(token: string): Promise<ApiResult<EventItem[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/my-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorJson: { message?: string } | null = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: errorJson?.message || "Failed to fetch your events.",
      };
    }
    const data: EventItem[] = await res.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function updateEvent(
  id: string,
  data: EventFormData,
  token: string
): Promise<ApiResult<{ message: string; event: EventItem }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const body: {
      message?: string;
      event?: EventItem;
      errors?: Record<string, string>;
    } | null = await res.json().catch(() => null);
    if (!res.ok || !body?.event) {
      return {
        ok: false,
        status: res.status || 500,
        message: body?.message || "Failed to update event.",
        errors: body?.errors,
      };
    }
    return {
      ok: true,
      data: {
        message: body.message || "Event updated successfully.",
        event: body.event,
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function deleteEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string; deletedId: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body: {
      message?: string;
      deletedId?: string;
    } | null = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message || "Failed to delete event.",
      };
    }
    return {
      ok: true,
      data: {
        message: body?.message || "Event deleted successfully.",
        deletedId: body?.deletedId || id,
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function joinEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string }>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/events/${encodeURIComponent(id)}/join`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const body: {
      message?: string;
    } | null = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message || "Failed to join event.",
      };
    }
    return {
      ok: true,
      data: {
        message: body?.message || "Joined event successfully.",
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function getJoinedEvents(token: string): Promise<ApiResult<EventItem[]>> {
  try {
    const res = await fetch(`${API_BASE_URL}/joined-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorJson: { message?: string } | null = await res.json().catch(() => null);
      return {
        ok: false,
        status: res.status,
        message: errorJson?.message || "Failed to fetch joined events.",
      };
    }
    const data: EventItem[] = await res.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

export async function cancelJoinEvent(
  id: string,
  token: string
): Promise<ApiResult<{ message: string }>> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/events/${encodeURIComponent(id)}/join`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const body: {
      message?: string;
    } | null = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message || "Failed to cancel RSVP.",
      };
    }
    return {
      ok: true,
      data: {
        message: body?.message || "RSVP cancelled successfully.",
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error. Failed to connect to server.",
    };
  }
}

