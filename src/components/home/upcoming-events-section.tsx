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
            subtitle="Community cleanups, donation drives, and relief efforts happening soon across Dhaka."
          />
          <Link
            href="/events"
            className={buttonVariants({
              variant: "outline",
              className:
                "group shrink-0 h-10 px-4 border-border/80 hover:bg-muted hover:border-primary/40 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 rounded-xl text-xs font-semibold",
            })}
          >
            <span>View all events</span>
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform duration-200 ease-out" />
          </Link>
        </div>

        {!res.ok ? (
          <ErrorState message={res.message} />
        ) : res.data.length === 0 ? (
          <EmptyState
            title="No upcoming events scheduled"
            description="There are currently no upcoming events scheduled. Create one to get volunteers together in your area."
            actionLabel="Create Event"
            actionHref="/create-event"
          />
        ) : (
          <EventGrid events={res.data} />
        )}
      </div>
    </section>
  );
}
