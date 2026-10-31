"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

interface EventThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
}

export function EventThumbnail({
  src,
  alt,
  className = "",
  aspectClassName = "aspect-video",
}: EventThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectClassName} bg-muted flex flex-col items-center justify-center text-muted-foreground ${className}`}
        aria-label={alt}
      >
        <ImageOff className="size-8 stroke-[1.5]" />
        <span className="text-xs mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClassName} overflow-hidden bg-muted ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
