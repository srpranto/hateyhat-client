import Link from "next/link";
import { getEvents } from "@/lib/api";
import { EventGrid } from "@/components/events/event-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function UpcomingEventsSection() {
  const res = await getEvents(6);

  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <SectionHeading
            badge="Happening Soon"
            title="Recent Upcoming Events"
            subtitle="The soonest community drives, cleanups, and relief distributions happening across Dhaka."
          />
          <Link
            href="/events"
            className={buttonVariants({
              variant: "outline",
              className:
                "shrink-0 h-10 border-border hover:bg-muted active:scale-[0.96] transition-transform flex items-center gap-2",
            })}
          >
            <span>View all events</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {!res.ok ? (
          <ErrorState message={res.message} />
        ) : res.data.length === 0 ? (
          <EmptyState
            title="No upcoming events scheduled"
            description="There are currently no upcoming initiatives on the calendar. Be the first to start a movement in your area."
            actionLabel="Host an Event"
            actionHref="/create-event"
          />
        ) : (
          <EventGrid events={res.data} />
        )}
      </div>
    </section>
  );
}
