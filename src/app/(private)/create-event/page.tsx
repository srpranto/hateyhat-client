import type { Metadata } from "next";
import { CreateEventForm } from "@/components/events/create-event-form";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Organize a new community social development event in Dhaka.",
};

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto mb-8">
        <SectionHeading
          badge="Host"
          title="Create a New Event"
          subtitle="Mobilize volunteers, set up resources, and lead a positive impact in your neighborhood."
        />
      </div>
      <CreateEventForm />
    </div>
  );
}
