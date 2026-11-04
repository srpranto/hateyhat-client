import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-dashed border-border/80 bg-card/60 backdrop-blur-xs shadow-xs">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-muted/80 text-muted-foreground mb-4 shadow-2xs">
        <CalendarX className="size-6" />
      </div>
      <h3 className="text-lg font-bold font-heading text-foreground mb-1 text-balance">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 text-pretty leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={buttonVariants({
            variant: "default",
            className:
              "h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl font-semibold text-xs shadow-xs",
          })}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
