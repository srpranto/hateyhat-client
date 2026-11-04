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
    <article className="group flex flex-col h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-xl hover:-translate-y-1.5 transition-[border-color,box-shadow,transform] duration-300">
      <div className="relative">
        <EventThumbnail src={event.thumbnail} alt={event.title} />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/80 shadow-xs rounded-full px-3 py-1"
          >
            {event.eventType}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums mb-2.5">
          <CalendarDays className="size-3.5 text-primary shrink-0" />
          <span className="font-medium text-foreground/80">{formattedDate}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 mb-2 font-heading group-hover:text-primary transition-colors leading-snug">
          {event.title}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed text-pretty">
          {event.description}
        </p>

        <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[62%]">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">{event.location}</span>
          </div>

          <Link
            href={`/events/${event._id}`}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className:
                "h-9 px-3.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-[opacity,transform] text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0",
            })}
          >
            <span>View Event</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
