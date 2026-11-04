import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CalendarX } from "lucide-react";

export default function EventNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center size-14 rounded-full bg-destructive/10 text-destructive mb-4">
        <CalendarX className="size-7" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
        Event Not Found
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The community event you requested does not exist or may have been removed.
      </p>
      <Link
        href="/events"
        className={buttonVariants({
          variant: "default",
          className:
            "h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl font-semibold text-xs shadow-xs",
        })}
      >
        Back to Upcoming Events
      </Link>
    </div>
  );
}
