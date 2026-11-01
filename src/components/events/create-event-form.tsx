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
        toast.success("Community initiative published successfully!");
        router.push("/events");
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
            <span>Community Organizer Portal</span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
            Host a New Community Initiative
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            Mobilize fellow citizens, neighbors, and volunteers across Dhaka. Share clear event logistics and pickup landmarks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <EventForm
            onSubmit={handleCreate}
            isSubmitting={submitting}
            submitLabel="Publish Initiative"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-muted/40 border border-border/70 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
          <span>Specify recognizable Dhaka landmarks (e.g., Rabindra Sarobar, Mirpur 10 roundabout) so volunteers can locate you effortlessly.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Users className="size-4 text-primary shrink-0 mt-0.5" />
          <span>All upcoming initiatives are immediately visible across the Dhaka community calendar for citizens to sign up and volunteer.</span>
        </div>
      </div>
    </div>
  );
}
