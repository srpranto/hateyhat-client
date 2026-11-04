import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/api";
import { formatEventDate } from "@/lib/date";
import { EventThumbnail } from "@/components/events/event-thumbnail";
import { JoinEventButton } from "@/components/events/join-event-button";
import { ShareEventButton } from "@/components/events/share-event-button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, ArrowLeft, ShieldCheck, HeartHandshake, User } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getEventById(id);
  if (!res.ok) {
    return {
      title: "Event Not Found",
    };
  }
  return {
    title: res.data.title,
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/events"
          className="group inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary active:scale-[0.96] transition-all duration-200 ease-out"
        >
          <ArrowLeft className="size-3.5 text-primary group-hover:-translate-x-1 transition-transform duration-200 ease-out" />
          <span>Back to upcoming events</span>
        </Link>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border/80 shadow-xl mb-10 ring-1 ring-black/5 dark:ring-white/10">
        <EventThumbnail
          src={event.thumbnail}
          alt={event.title}
          aspectClassName="aspect-16/9 sm:aspect-21/9"
          preload
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="text-xs px-3.5 py-1 font-semibold rounded-full bg-primary/10 text-primary border border-primary/25"
              >
                {event.eventType}
              </Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border/80 tabular-nums">
                <CalendarDays className="size-3.5 text-primary" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight text-balance leading-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base font-medium">
              <MapPin className="size-4 text-primary shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="border-t border-b border-border/70 py-8 space-y-4">
            <h2 className="text-xl font-bold font-heading text-foreground">
              About this event
            </h2>
            <div className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line text-pretty">
              {event.description}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-muted/40 border border-border/70 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <HeartHandshake className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-foreground">
                  Event Guidelines
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organized by local community members
                </p>
              </div>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Please arrive 10 to 15 minutes before the start time for a brief orientation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Supplies, gloves, and materials will be provided on site unless specified otherwise.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Wear comfortable clothing suitable for outdoor volunteer activities.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-24 space-y-5">
          <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-lg space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Volunteer Sign-Up
              </span>
              <h3 className="text-xl font-bold font-heading text-foreground pt-0.5">
                Join This Event
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sign up as an attendee or volunteer. Joining helps organizers prepare the right amount of supplies, water, and refreshments.
              </p>
            </div>

            <div>
              <JoinEventButton
                eventId={event._id}
                eventDate={event.eventDate}
              />
            </div>

            <div className="pt-3 border-t border-border/70">
              <ShareEventButton title={event.title} />
            </div>

            <div className="rounded-xl bg-muted/40 p-3.5 border border-border/70 text-[11px] text-muted-foreground leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span>Why joining in advance helps</span>
              </div>
              <p>
                An accurate headcount prevents supply shortages and helps events run smoothly on the ground.
              </p>
            </div>

            <div className="pt-2 border-t border-border/70 flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Free to attend. No fees or charges.</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center gap-3.5">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20 shrink-0">
              <User className="size-4" />
            </div>
            <div className="truncate text-left">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold">Organized by</p>
              <p className="text-xs font-bold text-foreground truncate">{event.creatorEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
