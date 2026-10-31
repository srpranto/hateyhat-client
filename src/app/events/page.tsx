import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventsExplorer } from "@/components/events/events-explorer";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Browse social development initiatives, winter clothes drives, and cleanups happening soon in Dhaka.",
};

export default async function EventsPage() {
  const res = await getEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <SectionHeading
          badge="Community Initiatives"
          title="Upcoming Social Events"
          subtitle="Explore grassroots causes organized by residents across Dhaka. Search, filter by cause type, or sort by date to find an initiative to join."
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
        <EventsExplorer initialEvents={res.data} />
      )}
    </div>
  );
}
