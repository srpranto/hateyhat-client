import type { Metadata } from "next";
import { ManageEventsList } from "@/components/events/manage-events-list";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Manage Events | ${SITE_NAME}`,
  description: "View, update, or delete the community events you have organized.",
};

export default function ManageEventsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto mb-8">
        <SectionHeading
          badge="Organizer"
          title="Manage Your Events"
          subtitle="Keep your event details accurate, update volunteer requirements, or manage cancellations."
        />
      </div>
      <div className="max-w-4xl mx-auto">
        <ManageEventsList />
      </div>
    </div>
  );
}
