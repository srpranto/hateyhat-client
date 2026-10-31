import type { EventItem } from "@/types/event";
import { EventCard } from "./event-card";

export function EventGrid({ events }: { events: EventItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
