"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getToken } from "@/lib/get-token";
import { updateEvent } from "@/lib/api";
import type { EventFormData, EventItem } from "@/types/event";
import { EventForm } from "./event-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface EditEventDialogProps {
  event: EventItem;
  onUpdated: (updated: EventItem) => void;
}

export function EditEventDialog({ event, onUpdated }: EditEventDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialData: EventFormData = {
    title: event.title,
    description: event.description,
    location: event.location,
    thumbnail: event.thumbnail,
    eventType: event.eventType,
    eventDate: event.eventDate,
  };

  const handleUpdate = async (formData: EventFormData) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login?redirect=%2Fmanage-events");
        setSubmitting(false);
        return;
      }

      const res = await updateEvent(event._id, formData, token);
      if (res.ok) {
        toast.success("Event updated successfully.");
        onUpdated(res.data.event);
        router.refresh();
        setOpen(false);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login?redirect=%2Fmanage-events");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 active:scale-[0.96] transition-[background-color,border-color,color,transform] duration-200 ease-out text-xs"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-heading">
            Edit Event
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Make changes to your event details below. The event date must remain in the future.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <EventForm
            initialData={initialData}
            onSubmit={handleUpdate}
            isSubmitting={submitting}
            submitLabel="Update Event"
            isUpdate={true}
            existingDate={event.eventDate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
