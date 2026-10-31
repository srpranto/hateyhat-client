import { EventGridSkeleton } from "@/components/events/event-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-3 mb-8">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <EventGridSkeleton count={6} />
    </div>
  );
}
