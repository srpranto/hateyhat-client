import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";

const GALLERY_ITEMS = [
  {
    src: "/gallery/gallery-01.jpg",
    caption: "Winter clothes distribution, Mirpur 10",
  },
  {
    src: "/gallery/gallery-02.jpg",
    caption: "Urban tree plantation drive, Dhanmondi Lake",
  },
  {
    src: "/gallery/gallery-03.jpg",
    caption: "Buriganga riverbank cleanup, Sadarghat",
  },
  {
    src: "/gallery/gallery-04.jpg",
    caption: "Hot meal distribution for unhoused families, Karwan Bazar",
  },
  {
    src: "/gallery/gallery-05.jpg",
    caption: "Voluntary blood donation camp, Dhaka Medical",
  },
  {
    src: "/gallery/gallery-06.jpg",
    caption: "Free pediatric health checkup, Rayerbazar",
  },
  {
    src: "/gallery/gallery-07.jpg",
    caption: "Open-air community school books drive, Korail",
  },
  {
    src: "/gallery/gallery-08.jpg",
    caption: "Youth environmental volunteers assembly, Shahbag",
  },
];

export function Gallery() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading
            badge="Field Stories"
            title="Moments of community in action"
            subtitle="Real memories and impact captured by volunteers across neighborhoods throughout Dhaka."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.src}
              className="group flex flex-col rounded-lg overflow-hidden border border-border bg-card shadow-xs hover:border-primary/50 transition-colors"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 bg-card border-t border-border">
                <p className="text-xs font-medium text-foreground line-clamp-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Photographs courtesy of community volunteers across Dhaka and open photo archives.
        </p>
      </div>
    </section>
  );
}
