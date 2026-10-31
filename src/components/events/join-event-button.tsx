"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";
import { getJoinedEvents, joinEvent, cancelJoinEvent } from "@/lib/api";
import { isUpcomingDhakaDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Loader2, XCircle } from "lucide-react";

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
        if (!ignore && res.ok && res.data.some((item) => item._id === eventId)) {
          setJoined(true);
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
      <Button disabled variant="outline" className="w-full sm:w-auto cursor-not-allowed rounded-xl h-11 px-6">
        Event ended
      </Button>
    );
  }

  const handleCancelRsvp = async () => {
    if (loading || cancelling) return;
    if (!session) {
      toast.error("Please log in to manage your RSVP.");
      router.push("/login");
      return;
    }

    setCancelling(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login");
        setCancelling(false);
        return;
      }

      const res = await cancelJoinEvent(eventId, token);
      if (res.ok) {
        setJoined(false);
        toast.success("Your RSVP has been cancelled.");
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
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
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Your session has expired or is invalid. Please log in again.");
        router.push("/login");
        setLoading(false);
        return;
      }

      const res = await joinEvent(eventId, token);
      if (res.ok) {
        setJoined(true);
        toast.success("Successfully joined the initiative! See you there.");
      } else if (res.status === 409) {
        setJoined(true);
        toast.info("You have already joined this event.");
      } else if (res.status === 401) {
        toast.error(res.message);
        router.push("/login");
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
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-xs font-semibold">
          <Check className="size-4 text-primary" />
          <span>You are attending</span>
        </div>
        <Button
          variant="outline"
          onClick={handleCancelRsvp}
          disabled={loading || cancelling}
          className="w-full sm:w-auto rounded-xl text-xs h-11 px-5 border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.97] transition-all"
        >
          {cancelling ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
              <span>Cancelling...</span>
            </>
          ) : (
            <>
              <XCircle className="size-3.5 mr-1.5" />
              <span>Cancel RSVP</span>
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
      className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all font-semibold h-11 px-8 rounded-xl shadow-md shadow-primary/20"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          Joining...
        </>
      ) : (
        "Join This Initiative"
      )}
    </Button>
  );
}
