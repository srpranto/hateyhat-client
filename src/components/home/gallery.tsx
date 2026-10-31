"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Maximize2 } from "lucide-react";

interface GalleryItem {
  src: string;
  caption: string;
  location: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/gallery/gallery-01.jpg",
    caption: "Winter clothes distribution for street vendors and families",
    location: "Mirpur 10 Circle, Dhaka",
    tag: "Donation",
  },
  {
    src: "/gallery/gallery-02.jpg",
    caption: "Urban tree plantation and sapling distribution along lakefront",
    location: "Dhanmondi Lake Walkway, Dhaka",
    tag: "Plantation",
  },
  {
    src: "/gallery/gallery-03.jpg",
    caption: "Buriganga riverbank plastic cleanup and ecological awareness drive",
    location: "Sadarghat Launch Terminal, Old Dhaka",
    tag: "Cleanup",
  },
  {
    src: "/gallery/gallery-04.jpg",
    caption: "Hot nutritious meal distribution for daily laborers and children",
    location: "Karwan Bazar Wholesale Market, Dhaka",
    tag: "Food Drive",
  },
  {
    src: "/gallery/gallery-05.jpg",
    caption: "Emergency voluntary blood donor assembly and donor cards",
    location: "Dhaka Medical College Grounds, Dhaka",
    tag: "Blood Drive",
  },
  {
    src: "/gallery/gallery-06.jpg",
    caption: "Free pediatric general checkup and medicine camp",
    location: "Rayerbazar Embankment, Dhaka",
    tag: "Health Camp",
  },
  {
    src: "/gallery/gallery-07.jpg",
    caption: "Open-air community school stationary and textbook drive",
    location: "Korail Slum Community Center, Dhaka",
    tag: "Education",
  },
  {
    src: "/gallery/gallery-08.jpg",
    caption: "Youth environmental volunteers coordinating city compost projects",
    location: "Shahbag Square, Dhaka",
    tag: "Youth Civic",
  },
];

export function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <section className="py-20 md:py-28 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeading
            badge="Field Stories"
            title="Moments of community in action"
            subtitle="Real photographs and field memories captured by volunteers and neighborhood organizers across Dhaka."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <button
              type="button"
              key={item.src}
              onClick={() => setSelectedItem(item)}
              className="group text-left flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card shadow-xs hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="size-10 rounded-full bg-background/90 text-foreground flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="size-4" />
                  </div>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[11px] font-semibold bg-background/90 backdrop-blur-md text-foreground px-2 py-0.5 rounded-full border border-border/80 shadow-xs">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-card border-t border-border/60 flex flex-col justify-between flex-1">
                <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2 leading-relaxed">
                  {item.caption}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate mt-auto">
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          {selectedItem && (
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border-border bg-card">
              <div className="relative aspect-16/10 w-full bg-muted">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <DialogHeader className="p-0 text-left mb-3">
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {selectedItem.tag}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {selectedItem.location}
                    </span>
                  </div>
                  <DialogTitle className="text-lg font-bold font-heading text-foreground">
                    {selectedItem.caption}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Captured during a volunteer community initiative organized under the HateyHat civic platform. Real impact driven directly by Dhaka neighborhood volunteers.
                </p>
              </div>
            </DialogContent>
          )}
        </Dialog>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Photographs courtesy of community volunteers across Dhaka. Clean citizen action, documented in the field.
        </p>
      </div>
    </section>
  );
}
