"use client";

import { useEffect, useState } from "react";
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

  const fetchJoined = async () => {
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

      const res = await getJoinedEvents(token);
      if (res.ok) {
        setEvents(res.data);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to load joined events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadJoined = async () => {
      try {
        const token = await getToken();
        if (ignore) return;
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await getJoinedEvents(token);
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
          setError("Failed to load joined events. Please try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadJoined();
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
        router.push("/login");
        setCancellingId(null);
        return;
      }

      const res = await cancelJoinEvent(eventId, token);
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item._id !== eventId));
        toast.success(`Cancelled RSVP for "${title}".`);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Could not cancel RSVP. Please try again.");
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
        description="You have not signed up to volunteer or attend any events yet. Explore upcoming initiatives across Dhaka to get involved."
        actionLabel="Browse Upcoming Events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-foreground">
        <CheckCircle2 className="size-4 text-primary shrink-0" />
        <span>
          You have committed to <strong className="text-primary tabular-nums">{events.length}</strong> community initiative{events.length === 1 ? "" : "s"} across Dhaka.
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
              className="group flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <EventThumbnail src={event.thumbnail} alt={event.title} />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/80 rounded-full px-3 py-1 shadow-xs"
                  >
                    {event.eventType}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums mb-2">
                  <CalendarDays className="size-3.5 text-primary shrink-0" />
                  <span className="font-medium text-foreground/80">{formattedDate}</span>
                </div>

                <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2 font-heading group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mb-4">
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
                        "h-9 px-3 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all text-xs font-semibold rounded-lg flex items-center gap-1.5",
                    })}
                  >
                    <span>Details</span>
                    <ArrowRight className="size-3.5" />
                  </Link>

                  {isUpcoming ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isCancelling}
                      onClick={() => handleCancelRsvp(event._id, event.title)}
                      className="h-9 px-3 text-xs rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.97] transition-all"
                    >
                      {isCancelling ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="size-3.5 mr-1" />
                          <span>Cancel RSVP</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/80 text-muted-foreground text-xs font-medium border border-border/60">
                      <CheckCircle2 className="size-3.5 text-primary" />
                      <span>Concluded</span>
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
