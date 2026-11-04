import Link from "next/link";
import { formatEventDate } from "@/lib/date";
import type { EventItem } from "@/types/event";
import { EventThumbnail } from "./event-thumbnail";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export function EventCard({ event }: { event: EventItem }) {
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-black/60 hover:ring-1 hover:ring-primary/25 hover:-translate-y-1 active:scale-[0.99] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <Link
        href={`/events/${event._id}`}
        className="relative block overflow-hidden focus:outline-hidden"
        aria-label={`View details for ${event.title}`}
      >
        <EventThumbnail src={event.thumbnail} alt={event.title} />
        <div className="absolute top-3 left-3 pointer-events-none">
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/80 shadow-xs rounded-full px-3 py-1 group-hover:border-primary/30 transition-colors duration-300 ease-out"
          >
            {event.eventType}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums mb-2.5">
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

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed text-pretty">
          {event.description}
        </p>

        <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[62%]" title={event.location}>
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">{event.location}</span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className:
                "h-9 px-3.5 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0",
            })}
          >
            <span>View Event</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
