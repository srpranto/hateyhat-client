import Link from "next/link";
import { formatEventDate } from "@/lib/date";
import type { EventItem } from "@/types/event";
import { EventThumbnail } from "./event-thumbnail";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";

export function EventCard({ event }: { event: EventItem }) {
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <div className="group flex flex-col h-full rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <EventThumbnail src={event.thumbnail} alt={event.title} />
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5"
          >
            {event.eventType}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
            <CalendarDays className="size-3.5 text-primary shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2 font-heading group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[60%]">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className:
                "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform text-xs rounded-lg shadow-xs",
            })}
          >
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
}
