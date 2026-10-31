"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";
import { getJoinedEvents, joinEvent } from "@/lib/api";
import { isUpcomingDhakaDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

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
      <Button disabled variant="outline" className="w-full sm:w-auto cursor-not-allowed">
        Event ended
      </Button>
    );
  }

  if (joined) {
    return (
      <Button
        disabled
        variant="outline"
        className="w-full sm:w-auto border-primary/40 text-primary font-medium"
      >
        <Check className="size-4 mr-2" />
        Joined
      </Button>
    );
  }

  const handleJoin = async () => {
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
        toast.success("Successfully joined the event.");
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

  return (
    <Button
      onClick={handleJoin}
      disabled={loading}
      className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform font-medium h-11 px-8"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          Joining...
        </>
      ) : (
        "Join Event"
      )}
    </Button>
  );
}
