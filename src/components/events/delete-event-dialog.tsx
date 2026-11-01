"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getToken } from "@/lib/get-token";
import { deleteEvent } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteEventDialogProps {
  eventId: string;
  eventTitle: string;
  onDeleted: (deletedId: string) => void;
}

export function DeleteEventDialog({
  eventId,
  eventTitle,
  onDeleted,
}: DeleteEventDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login?redirect=%2Fmanage-events");
        setDeleting(false);
        return;
      }

      const res = await deleteEvent(eventId, token);
      if (res.ok) {
        toast.success("Event deleted successfully.");
        onDeleted(eventId);
        setOpen(false);
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login?redirect=%2Fmanage-events");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive active:scale-[0.96] transition-transform text-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete &ldquo;{eventTitle}&rdquo;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
