"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/get-token";
import { getMyEvents } from "@/lib/api";
import type { EventItem } from "@/types/event";
import { ManageEventCard } from "./manage-event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";

export function ManageEventsList() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login");
        setLoading(false);
        return;
      }

      const res = await getMyEvents(token);
      if (res.ok) {
        setEvents(res.data);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to load your events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadEvents = async () => {
      try {
        const token = await getToken();
        if (ignore) return;
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await getMyEvents(token);
        if (ignore) return;
        if (res.ok) {
          setEvents(res.data);
        } else if (res.status === 401) {
          toast.error(res.message);
          router.push("/login");
        } else {
          setError(res.message);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load your events. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      ignore = true;
    };
  }, [router]);

  const handleUpdated = (updated: EventItem) => {
    setEvents((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item))
    );
  };

  const handleDeleted = (deletedId: string) => {
    setEvents((prev) => prev.filter((item) => item._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-border/80 bg-card"
          >
            <Skeleton className="sm:w-52 h-32 rounded-lg shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMyEvents} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No events hosted yet"
        description="You have not created any events yet. Organize a local drive, cleanup, or health camp to get started."
        actionLabel="Create Event"
        actionHref="/create-event"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold font-heading text-foreground">
            Organizer Overview
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            You are managing <span className="font-semibold text-primary tabular-nums">{events.length}</span> community initiative{events.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/create-event"
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className:
              "h-10 px-5 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs",
          })}
        >
          <span>Host Another Initiative</span>
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <ManageEventCard
            key={event._id}
            event={event}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </div>
  );
}
