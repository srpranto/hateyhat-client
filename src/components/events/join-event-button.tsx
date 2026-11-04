"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";
import { getJoinedEvents, joinEvent, cancelJoinEvent } from "@/lib/api";
import { isUpcomingDhakaDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Loader2, UserPlus, XCircle } from "lucide-react";

interface JoinEventButtonProps {
  eventId: string;
  eventDate: string;
  isInitiallyJoined?: boolean;
}

export function JoinEventButton({
  eventId,
  eventDate,
  isInitiallyJoined = false,
}: JoinEventButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [joined, setJoined] = useState(isInitiallyJoined);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let ignore = false;
    const checkAlreadyJoined = async () => {
      if (!session) return;
      try {
        const token = await getToken();
        if (!token || ignore) return;
        const res = await getJoinedEvents(token);
        if (!ignore && res.ok) {
          setJoined(res.data.some((item) => item._id === eventId));
        }
      } catch {
      }
    };
    checkAlreadyJoined();
    return () => {
      ignore = true;
    };
  }, [session, eventId]);

  const isUpcoming = isUpcomingDhakaDate(eventDate);

  if (!isUpcoming) {
    return (
      <Button disabled variant="outline" className="w-full cursor-not-allowed rounded-xl h-11 px-6 text-xs font-semibold bg-muted/50 text-muted-foreground border-border/80 flex items-center justify-center gap-2">
        Initiative concluded
      </Button>
    );
  }

  const getLoginRedirectUrl = () => {
    const currentPath = pathname || `/events/${eventId}`;
    return `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleCancelRsvp = async () => {
    if (loading || cancelling) return;
    if (!session) {
      toast.error("Please log in to manage your RSVP.");
      router.push(getLoginRedirectUrl());
      return;
    }

    setCancelling(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push(getLoginRedirectUrl());
        setCancelling(false);
        return;
      }

      const res = await cancelJoinEvent(eventId, token);
      if (res.ok) {
        setJoined(false);
        toast.success("Your RSVP has been cancelled.");
        router.refresh();
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push(getLoginRedirectUrl());
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Could not cancel RSVP. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const handleJoin = async () => {
    if (loading || cancelling) return;
    if (!session) {
      toast.error("Please log in to join this event.");
      router.push(getLoginRedirectUrl());
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired or is invalid. Please log in again.");
        router.push(getLoginRedirectUrl());
        setLoading(false);
        return;
      }

      const res = await joinEvent(eventId, token);
      if (res.ok) {
        setJoined(true);
        toast.success("Successfully joined the initiative! See you there.");
        router.refresh();
      } else if (res.status === 409) {
        setJoined(true);
        toast.info("You have already joined this event.");
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push(getLoginRedirectUrl());
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Could not complete join request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <div className="flex flex-col gap-2.5 w-full">
        <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Check className="size-4 text-primary shrink-0" />
          <span>You are registered to attend</span>
        </div>
        <Button
          variant="outline"
          onClick={handleCancelRsvp}
          disabled={loading || cancelling}
          className="w-full rounded-xl text-xs h-10 border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.96] transition-[background-color,border-color,color,transform] font-medium flex items-center justify-center gap-1.5"
        >
          {cancelling ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Cancelling reservation...</span>
            </>
          ) : (
            <>
              <XCircle className="size-3.5" />
              <span>Cancel Attendance (RSVP)</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      disabled={loading || cancelling}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.96] transition-[background-color,box-shadow,transform] font-semibold h-11 px-6 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Joining Event...</span>
        </>
      ) : (
        <>
          <UserPlus className="size-4 shrink-0" />
          <span>Join Event</span>
        </>
      )}
    </Button>
  );
}

