"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/get-token";
import { getJoinedEvents, cancelJoinEvent } from "@/lib/api";
import { formatEventDate, isUpcomingDhakaDate } from "@/lib/date";
import type { EventItem } from "@/types/event";
import { EventThumbnail } from "./event-thumbnail";
import { EventGridSkeleton } from "./event-grid-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarDays, MapPin, XCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function JoinedEventsList() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJoined = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login?redirect=%2Fjoined-events");
        setLoading(false);
        return;
      }

      const res = await getJoinedEvents(token);
      if (res.ok) {
        setEvents(res.data);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login?redirect=%2Fjoined-events");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to load joined events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const token = await getToken();
        if (ignore) return;
        if (!token) {
          router.push("/login?redirect=%2Fjoined-events");
          return;
        }

        const res = await getJoinedEvents(token);
        if (ignore) return;
        if (res.ok) {
          setEvents(res.data);
        } else if (res.status === 401) {
          toast.error(res.message);
          router.push("/login?redirect=%2Fjoined-events");
        } else {
          setError(res.message);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load joined events. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void init();
    return () => {
      ignore = true;
    };
  }, [router]);

  const handleCancelRsvp = async (eventId: string, title: string) => {
    setCancellingId(eventId);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login?redirect=%2Fjoined-events");
        setCancellingId(null);
        return;
      }

      const res = await cancelJoinEvent(eventId, token);
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item._id !== eventId));
        toast.success(`Cancelled attendance for "${title}".`);
        router.refresh();
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login?redirect=%2Fjoined-events");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Could not cancel attendance. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <EventGridSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJoined} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No joined events yet"
        description="You have not signed up for any events yet. Explore upcoming community drives across Dhaka to get involved."
        actionLabel="Browse Events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground">
        <CheckCircle2 className="size-4 text-primary shrink-0" />
        <span>
          You are attending <strong className="text-primary tabular-nums">{events.length}</strong> upcoming event{events.length === 1 ? "" : "s"}.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const formattedDate = formatEventDate(event.eventDate);
          const isUpcoming = isUpcomingDhakaDate(event.eventDate);
          const isCancelling = cancellingId === event._id;

          return (
            <article
              key={event._id}
              className="group flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-black/60 hover:ring-1 hover:ring-primary/25 hover:-translate-y-1 active:scale-[0.99] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <Link
                href={`/events/${event._id}`}
                className="relative block overflow-hidden focus:outline-hidden"
                aria-label={`View details for ${event.title}`}
              >
                <EventThumbnail src={event.thumbnail} alt={event.title} />
                <div className="absolute top-3 left-3 pointer-events-none">
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/80 rounded-full px-3 py-1 shadow-xs group-hover:border-primary/30 transition-colors duration-300 ease-out"
                  >
                    {event.eventType}
                  </Badge>
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums mb-2">
                  <CalendarDays className="size-3.5 text-primary shrink-0" />
                  <span className="font-medium text-foreground/80">{formattedDate}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 mb-2 font-heading leading-snug">
                  <Link
                    href={`/events/${event._id}`}
                    title={event.title}
                    className="hover:text-primary group-hover:text-primary transition-colors duration-200 ease-out focus-visible:outline-hidden focus-visible:underline"
                  >
                    {event.title}
                  </Link>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mb-4" title={event.location}>
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-2">
                  <Link
                    href={`/events/${event._id}`}
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className:
                        "h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold rounded-lg flex items-center gap-1.5",
                    })}
                  >
                    <span>View Event</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </Link>

                  {isUpcoming ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCancelling}
                      onClick={() => handleCancelRsvp(event._id, event.title)}
                      className="h-9 px-3 text-xs rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-200 ease-out"
                    >
                      {isCancelling ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="size-3.5 mr-1" />
                          <span>Cancel</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/80 text-muted-foreground text-xs font-medium border border-border/60">
                      <CheckCircle2 className="size-3.5 text-primary" />
                      <span>Event Passed</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
