import type { Metadata } from "next";
import { JoinedEventsList } from "@/components/events/joined-events-list";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Joined Events",
  description: "View community events you have signed up for across Dhaka.",
};

export default function JoinedEventsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <SectionHeading
          badge="Volunteer"
          title="Events You Have Joined"
          subtitle="All the upcoming community drives, relief programs, and cleanups you signed up to attend."
        />
      </div>
      <JoinedEventsList />
    </div>
  );
}
