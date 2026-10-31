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
              text: `Join the community initiative: "${title}" on HateyHat`,
              url: window.location.href,
            });
            setCopied(true);
            toast.success("Shared successfully!");
            setTimeout(() => setCopied(false), 2000);
            return;
          } catch {
          }
        }
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success(`Link to "${title}" copied to clipboard.`);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("Could not copy link to clipboard.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="w-full rounded-xl text-xs font-semibold h-10 border-border text-foreground hover:bg-muted active:scale-[0.97] transition-all flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-primary" />
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5" />
          <span>Share Initiative</span>
        </>
      )}
    </Button>
  );
}
