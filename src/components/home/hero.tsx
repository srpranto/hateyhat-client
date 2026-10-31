import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, CalendarPlus, Sparkles, MapPin, Users, HeartHandshake } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60">
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 size-96 rounded-full bg-primary/15 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/3 left-0 -z-10 size-80 rounded-full bg-primary/10 blur-3xl opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-primary/25 bg-primary/10 text-foreground backdrop-blur-xs">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-semibold text-primary">হাতে হাত • HateyHat</span>
              <span className="text-muted-foreground">|</span>
              <span>Civic Action Across Dhaka</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading text-balance leading-[1.1]">
              Show up for your neighbourhood.{" "}
              <span className="block sm:inline text-primary italic font-serif">{" "}Hand in hand.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed">
              Connect with fellow Dhaka residents for winter blanket drives in Mirpur, urban tree planting at Dhanmondi Lake, and riverbank cleanups at Sadarghat. Or step up and host an initiative on your own street.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/events"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className:
                    "h-12 px-7 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all font-semibold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 rounded-xl",
                })}
              >
                <span>Explore upcoming events</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/create-event"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-12 px-7 border-border/80 bg-card/60 backdrop-blur-xs hover:bg-muted active:scale-[0.97] transition-all font-semibold text-sm flex items-center justify-center gap-2 rounded-xl",
                })}
              >
                <CalendarPlus className="size-4 text-primary" />
                <span>Host an event</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60 w-full max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HeartHandshake className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground font-heading">100% Grassroots</div>
                  <div className="text-[11px] text-muted-foreground">Citizen-led drives</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground font-heading">All Dhaka Zones</div>
                  <div className="text-[11px] text-muted-foreground">North & South</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground font-heading">Direct Impact</div>
                  <div className="text-[11px] text-muted-foreground">Zero red tape</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 w-full rounded-2xl overflow-hidden shadow-2xl border border-border/80 ring-1 ring-black/5 dark:ring-white/10 group">
              <Image
                src="/hero.jpg"
                alt="Community volunteers organizing relief supplies together in Dhaka"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="size-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="truncate text-left">
                    <p className="text-xs font-semibold text-foreground truncate">Active Community Hub</p>
                    <p className="text-[11px] text-muted-foreground truncate">Join neighborhood drives this week</p>
                  </div>
                </div>
                <Link
                  href="/events"
                  className="shrink-0 text-xs font-semibold text-primary hover:underline"
                >
                  View drives →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
