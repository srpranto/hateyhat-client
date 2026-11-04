"use client";

import Link from "next/link";
import { formatEventDate } from "@/lib/date";
import type { EventItem } from "@/types/event";
import { EventThumbnail } from "./event-thumbnail";
import { EditEventDialog } from "./edit-event-dialog";
import { DeleteEventDialog } from "./delete-event-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";

interface ManageEventCardProps {
  event: EventItem;
  onUpdated: (updated: EventItem) => void;
  onDeleted: (deletedId: string) => void;
}

export function ManageEventCard({
  event,
  onUpdated,
  onDeleted,
}: ManageEventCardProps) {
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl border border-border/80 bg-card shadow-xs hover:border-primary/30 transition-[border-color,box-shadow] duration-200">
      <div className="sm:w-52 aspect-16/10 rounded-lg overflow-hidden shrink-0 border border-border/50">
        <EventThumbnail
          src={event.thumbnail}
          alt={event.title}
          aspectClassName="aspect-16/10"
        />
      </div>

      <div className="flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5"
            >
              {event.eventType}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
              <CalendarDays className="size-3.5 text-primary" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground font-heading mb-1 line-clamp-1">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/70">
          <Link
            href={`/events/${event._id}`}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs text-muted-foreground hover:text-foreground h-8 px-2 rounded-lg",
            })}
          >
            <ExternalLink className="size-3.5 mr-1 text-primary" />
            <span>View details</span>
          </Link>

          <div className="flex items-center gap-2">
            <EditEventDialog event={event} onUpdated={onUpdated} />
            <DeleteEventDialog
              eventId={event._id}
              eventTitle={event.title}
              onDeleted={onDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
