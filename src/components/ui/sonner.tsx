"use client";

import { useTheme } from "@/context/theme-context";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4.5 text-primary shrink-0" />,
        info: <InfoIcon className="size-4.5 text-foreground shrink-0" />,
        warning: <TriangleAlertIcon className="size-4.5 text-amber-500 shrink-0" />,
        error: <OctagonXIcon className="size-4.5 text-destructive shrink-0" />,
        loading: <Loader2Icon className="size-4.5 text-primary animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-2xl border border-border/80 bg-popover/95 text-popover-foreground backdrop-blur-md shadow-xl px-4 py-3 font-sans text-xs sm:text-sm flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          title: "font-semibold text-foreground text-xs sm:text-sm",
          description: "text-muted-foreground text-xs",
          actionButton:
            "bg-primary text-primary-foreground font-semibold rounded-xl px-3 py-1.5 text-xs shadow-xs hover:bg-primary/90 transition-colors",
          cancelButton:
            "bg-muted text-muted-foreground font-medium rounded-xl px-3 py-1.5 text-xs hover:bg-muted/80 transition-colors",
          error: "!border-destructive/30 !text-destructive",
          success: "!border-primary/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
