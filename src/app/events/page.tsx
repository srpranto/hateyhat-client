import type { Metadata } from "next";
import { getEvents } from "@/lib/api";
import { EventsExplorer } from "@/components/events/events-explorer";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Browse community drives, cleanups, and relief events happening soon across Dhaka.",
};

export default async function EventsPage() {
  const res = await getEvents();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <SectionHeading
          badge="Community Drives"
          title="Upcoming Events"
          subtitle="Explore community drives organized by residents across Dhaka. Search, filter by category, or find an event to join."
        />
      </div>

      {!res.ok ? (
        <ErrorState
          title="Could not load events"
          message={res.message}
        />
      ) : res.data.length === 0 ? (
        <EmptyState
          title="No upcoming events scheduled"
          description="There are currently no upcoming events scheduled. Create one to get volunteers together in your area."
          actionLabel="Create Event"
          actionHref="/create-event"
        />
      ) : (
        <EventsExplorer initialEvents={res.data} />
      )}
    </div>
  );
}
