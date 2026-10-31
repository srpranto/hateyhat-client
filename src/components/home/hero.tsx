import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, CalendarPlus } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-border/40">
      <div className="pointer-events-none absolute -top-32 right-1/4 -z-10 size-96 rounded-full bg-primary/10 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/2 left-0 -z-10 size-72 rounded-full bg-primary/5 blur-3xl opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border border-primary/25 bg-primary/10 text-foreground">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>Grassroots Social Initiatives in Dhaka</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground font-heading text-balance leading-[1.12]">
              Show up for your neighbourhood.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
              Join winter clothes drives, blanket distributions, cleanups and plantations across Dhaka, or start one on your own street.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/events"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className:
                    "h-11 px-6 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all font-medium text-sm shadow-xs flex items-center justify-center gap-2 rounded-lg",
                })}
              >
                <span>Browse upcoming events</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/create-event"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-11 px-6 border-border hover:bg-muted active:scale-[0.98] transition-all font-medium text-sm flex items-center justify-center gap-2 rounded-lg",
                })}
              >
                <CalendarPlus className="size-4 text-primary" />
                <span>Host an event</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 w-full rounded-2xl overflow-hidden shadow-lg border border-border/80 ring-1 ring-black/5 dark:ring-white/5">
              <Image
                src="/hero.jpg"
                alt="Community volunteers organizing relief supplies together"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
