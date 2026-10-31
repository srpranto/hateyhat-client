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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-border bg-card">
      <div className="flex items-center justify-center size-12 rounded-full bg-muted text-muted-foreground mb-4">
        <CalendarX className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1 text-balance">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 text-pretty">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={buttonVariants({
            variant: "default",
            className:
              "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform",
          })}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
