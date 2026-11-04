import type { Metadata } from "next";
import { ManageEventsList } from "@/components/events/manage-events-list";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "View, update, or delete the community events you have organized.",
};

export default function ManageEventsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto mb-8">
        <SectionHeading
          badge="My Events"
          title="Manage Events"
          subtitle="Review, update, or remove the events you have created."
        />
      </div>
      <div className="max-w-4xl mx-auto">
        <ManageEventsList />
      </div>
    </div>
  );
}
