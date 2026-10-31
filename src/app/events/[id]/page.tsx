import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/api";
import { formatEventDate } from "@/lib/date";
import { SITE_NAME } from "@/lib/constants";
import { EventThumbnail } from "@/components/events/event-thumbnail";
import { JoinEventButton } from "@/components/events/join-event-button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getEventById(id);
  if (!res.ok) {
    return {
      title: `Event Not Found | ${SITE_NAME}`,
    };
  }
  return {
    title: `${res.data.title} | ${SITE_NAME}`,
    description: res.data.description.slice(0, 160),
  };
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getEventById(id);

  if (!res.ok) {
    notFound();
  }

  const event = res.data;
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <div className="rounded-2xl overflow-hidden border border-border/80 shadow-md mb-8">
        <EventThumbnail
          src={event.thumbnail}
          alt={event.title}
          aspectClassName="aspect-21/9"
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className="text-xs px-3.5 py-1 font-medium rounded-full bg-primary/10 text-primary border border-primary/25"
          >
            {event.eventType}
          </Badge>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-muted/80 text-foreground border border-border/80 tabular-nums">
            <CalendarDays className="size-3.5 text-primary" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-foreground tracking-tight text-balance leading-tight">
          {event.title}
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
          <MapPin className="size-4 text-primary shrink-0" />
          <span>{event.location}</span>
        </div>

        <div className="border-t border-b border-border/80 py-8 my-6">
          <h2 className="text-xl font-semibold font-heading mb-3 text-foreground">
            About this initiative
          </h2>
          <div className="max-w-none text-muted-foreground whitespace-pre-line leading-relaxed text-pretty text-sm sm:text-base">
            {event.description}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground font-heading">
              Ready to take part?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Confirm your presence to coordinate with organizers and fellow volunteers.
            </p>
          </div>
          <JoinEventButton
            eventId={event._id}
            eventDate={event.eventDate}
          />
        </div>
      </div>
    </div>
  );
}
