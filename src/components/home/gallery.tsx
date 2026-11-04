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
    caption: "Winter clothes distribution for families and street vendors",
    location: "Mirpur 10 Circle, Dhaka",
    tag: "Donation",
  },
  {
    src: "/gallery/gallery-02.jpg",
    caption: "Tree planting and sapling distribution along the lakeside",
    location: "Dhanmondi Lake Walkway, Dhaka",
    tag: "Plantation",
  },
  {
    src: "/gallery/gallery-03.jpg",
    caption: "Riverbank plastic cleanup and environmental awareness drive",
    location: "Sadarghat Launch Terminal, Old Dhaka",
    tag: "Cleanup",
  },
  {
    src: "/gallery/gallery-04.jpg",
    caption: "Hot meal distribution for day laborers and children",
    location: "Karwan Bazar Wholesale Market, Dhaka",
    tag: "Food Drive",
  },
  {
    src: "/gallery/gallery-05.jpg",
    caption: "Voluntary blood donation camp and donor registry",
    location: "Dhaka Medical College Grounds, Dhaka",
    tag: "Blood Drive",
  },
  {
    src: "/gallery/gallery-06.jpg",
    caption: "Free general health checkup and medicine camp",
    location: "Rayerbazar Embankment, Dhaka",
    tag: "Health Camp",
  },
  {
    src: "/gallery/gallery-07.jpg",
    caption: "Textbook and school stationery drive for young learners",
    location: "Korail Community Center, Dhaka",
    tag: "Education",
  },
  {
    src: "/gallery/gallery-08.jpg",
    caption: "Youth volunteers organizing neighbourhood waste composting",
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
            subtitle="Photographs from volunteer drives and social service initiatives across Dhaka."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <button
              type="button"
              key={item.src}
              onClick={() => setSelectedItem(item)}
              title={`View story: ${item.caption}`}
              className="group text-left flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card shadow-xs hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-black/60 hover:ring-1 hover:ring-primary/25 hover:-translate-y-1 active:scale-[0.98] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-[filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:brightness-[1.03]"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center">
                  <div className="size-10 rounded-full bg-background/90 text-foreground flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
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
                <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2 leading-relaxed group-hover:text-primary transition-colors duration-200 ease-out">
                  {item.caption}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate mt-auto" title={item.location}>
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Dialog open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
          {selectedItem && (
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border-border bg-card">
              <div className="relative aspect-16/10 w-full bg-muted">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 576px"
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
                  Documented during a community drive organized by local volunteers in Dhaka.
                </p>
              </div>
            </DialogContent>
          )}
        </Dialog>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Photographs shared by community volunteers across Dhaka.
        </p>
      </div>
    </section>
  );
}
