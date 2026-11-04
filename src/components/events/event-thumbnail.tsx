"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { isValidImageSrc, normalizeImageUrl } from "@/lib/validation";

interface EventThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  unoptimized?: boolean;
  preload?: boolean;
}

export function EventThumbnail({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-video",
  unoptimized = true,
  preload = false,
}: EventThumbnailProps) {
  const normalizedSrc = normalizeImageUrl(src);
  const [prevSrc, setPrevSrc] = useState(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (prevSrc !== src) {
    setPrevSrc(src);
    setFailedSrc(null);
  }

  const isValid = isValidImageSrc(normalizedSrc);
  const isFailed = Boolean(normalizedSrc && failedSrc === normalizedSrc);

  if (!isValid || isFailed || !normalizedSrc) {
    return (
      <div
        className={`w-full ${aspectClassName} bg-muted/60 border border-border/60 flex flex-col items-center justify-center text-muted-foreground p-4 text-center select-none ${className}`}
        aria-label={alt}
      >
        <div className="size-10 rounded-full bg-background/80 flex items-center justify-center border border-border/80 shadow-xs mb-1.5">
          <ImageOff className="size-5 stroke-[1.5] text-muted-foreground/70" />
        </div>
        <span className="text-xs font-semibold text-foreground/80">Image preview unavailable</span>
        <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 max-w-[85%]">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClassName} overflow-hidden bg-muted after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-black/10 dark:after:ring-white/10 ${className}`}>
      <Image
        src={normalizedSrc}
        alt={alt}
        fill
        preload={preload}
        unoptimized={unoptimized}
        referrerPolicy="no-referrer"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setFailedSrc(normalizedSrc)}
      />
    </div>
  );
}

