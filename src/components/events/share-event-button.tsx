"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Check } from "lucide-react";

export function ShareEventButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
          try {
            await navigator.share({
              title,
              text: `Join "${title}" on HateyHat`,
              url: window.location.href,
            });
            setCopied(true);
            toast.success("Shared successfully.");
            setTimeout(() => setCopied(false), 2000);
            return;
          } catch {
          }
        }
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard.");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      title="Share initiative or copy link to clipboard"
      className="w-full rounded-xl text-xs font-semibold h-10 border-border/80 text-foreground hover:bg-muted hover:border-primary/40 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-primary" />
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5" />
          <span>Share Event</span>
        </>
      )}
    </Button>
  );
}
