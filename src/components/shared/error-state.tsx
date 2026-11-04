import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Could not load data. Please try again later.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-destructive/25 bg-destructive/5 shadow-xs">
      <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-2xs">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-lg font-bold font-heading text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 text-pretty leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="h-10 px-5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-semibold"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
