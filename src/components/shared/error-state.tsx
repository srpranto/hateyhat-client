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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-destructive/20 bg-destructive/5">
      <div className="flex items-center justify-center size-12 rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="active:scale-[0.96] transition-transform"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
