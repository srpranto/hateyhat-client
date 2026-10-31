import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventGrid } from "@/components/events/event-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Upcoming Events | ${SITE_NAME}`,
  description: "Browse social development initiatives, winter clothes drives, and cleanups happening soon in Dhaka.",
};

export default async function EventsPage() {
  const res = await getEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <SectionHeading
          badge="Community Initiatives"
          title="Upcoming Social Events"
          subtitle="Explore grassroots causes organized by residents across Dhaka. Find an event to join or lend a helping hand."
        />
      </div>

      {!res.ok ? (
        <ErrorState
          title="Could not load events"
          message={res.message}
        />
      ) : res.data.length === 0 ? (
        <EmptyState
          title="No upcoming events yet"
          description="There are currently no upcoming events scheduled. Be the first in your neighborhood to organize one."
          actionLabel="Create Event"
          actionHref="/create-event"
        />
      ) : (
        <EventGrid events={res.data} />
      )}
    </div>
  );
}
