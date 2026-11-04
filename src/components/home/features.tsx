import { SectionHeading } from "@/components/shared/section-heading";
import { CalendarPlus, CheckCircle2, Settings2, BookmarkCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    step: "01",
    icon: CalendarPlus,
    title: "Host an event",
    description: "Create a cleanup, donation drive, or relief event with clear dates, pickup points, and volunteer goals.",
    href: "/create-event",
    action: "Create an event",
  },
  {
    step: "02",
    icon: CheckCircle2,
    title: "Join with one click",
    description: "Sign up to volunteer or attend in seconds. Give organizers a reliable headcount for supplies and gear.",
    href: "/events",
    action: "Browse events",
  },
  {
    step: "03",
    icon: Settings2,
    title: "Manage what you host",
    description: "Update event details, change meeting locations, or cancel initiatives whenever plans on the ground change.",
    href: "/manage-events",
    action: "Manage events",
  },
  {
    step: "04",
    icon: BookmarkCheck,
    title: "Track your events",
    description: "Keep track of all the community drives you have signed up for, with upcoming dates and locations in one place.",
    href: "/joined-events",
    action: "View joined events",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-28 border-b border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <SectionHeading
            badge="How It Works"
            title="Community action across Dhaka, made simple"
            subtitle="A straightforward platform for residents, student groups, and volunteers to organize and participate in social service events together."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between p-7 rounded-2xl border border-border/80 bg-card hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-black/60 hover:ring-1 hover:ring-primary/25 hover:-translate-y-1 active:scale-[0.99] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:shadow-sm group-hover:shadow-primary/30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xs">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-2xl font-black font-heading text-muted-foreground/30 tabular-nums group-hover:text-primary/50 transition-colors duration-200 ease-out">
                      {feature.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-foreground mb-2.5 group-hover:text-primary transition-colors duration-200 ease-out">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <span>{feature.action}</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
