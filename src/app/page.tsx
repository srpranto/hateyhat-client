import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section";
import { Gallery } from "@/components/home/gallery";
import { Newsletter } from "@/components/home/newsletter";
import { EventGridSkeleton } from "@/components/events/event-grid-skeleton";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <EventGridSkeleton count={6} />
          </div>
        }
      >
        <UpcomingEventsSection />
      </Suspense>
      <Gallery />
      <Newsletter />
    </div>
  );
}
