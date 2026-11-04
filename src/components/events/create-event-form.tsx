"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getToken } from "@/lib/get-token";
import { createEvent } from "@/lib/api";
import type { EventFormData } from "@/types/event";
import { EventForm } from "./event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, MapPin, Users } from "lucide-react";

export function CreateEventForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (formData: EventFormData) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login?redirect=%2Fcreate-event");
        setSubmitting(false);
        return;
      }

      const res = await createEvent(formData, token);
      if (res.ok) {
        toast.success("Event created successfully.");
        router.push("/events");
        router.refresh();
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login?redirect=%2Fcreate-event");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="shadow-lg border-border/80 bg-card rounded-3xl overflow-hidden">
        <CardHeader className="space-y-2 p-6 sm:p-8 bg-muted/30 border-b border-border/70">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">
            <Sparkles className="size-3.5" />
            <span>New Event</span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
            Create an Event
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            Fill in the details below to publish your community drive and invite volunteers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <EventForm
            onSubmit={handleCreate}
            isSubmitting={submitting}
            submitLabel="Create Event"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-muted/40 border border-border/70 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
          <span>Use familiar landmarks (such as Mirpur 10 Circle or Rabindra Sarobar) so attendees can find the meeting point easily.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Users className="size-4 text-primary shrink-0 mt-0.5" />
          <span>Once published, your event is immediately listed on the Upcoming Events page for others to discover and join.</span>
        </div>
      </div>
    </div>
  );
}
