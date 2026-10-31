"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getToken } from "@/lib/get-token";
import { createEvent } from "@/lib/api";
import type { EventFormData } from "@/types/event";
import { EventForm } from "./event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function CreateEventForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (formData: EventFormData) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login");
        setSubmitting(false);
        return;
      }

      const res = await createEvent(formData, token);
      if (res.ok) {
        toast.success("Event created successfully.");
        router.push("/events");
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
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
    <Card className="max-w-2xl mx-auto shadow-sm border-border bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold font-heading text-foreground">
          Host a community event
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Fill out the details below to mobilize volunteers across your neighborhood in Dhaka.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EventForm
          onSubmit={handleCreate}
          isSubmitting={submitting}
          submitLabel="Create Event"
        />
      </CardContent>
    </Card>
  );
}
