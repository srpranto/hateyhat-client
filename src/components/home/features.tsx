import { SectionHeading } from "@/components/shared/section-heading";
import { CalendarPlus, CheckCircle2, Settings2, BookmarkCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    step: "01",
    icon: CalendarPlus,
    title: "Host in minutes",
    description: "Launch community drives, cleanups, or emergency relief events with simple details, landmark pickup spots, and clear volunteer goals.",
    href: "/create-event",
    action: "Host an initiative",
  },
  {
    step: "02",
    icon: CheckCircle2,
    title: "Join with one click",
    description: "Support local neighborhood efforts and sign up as a volunteer or donor without friction. Get direct coordination on the ground.",
    href: "/events",
    action: "Browse events",
  },
  {
    step: "03",
    icon: Settings2,
    title: "Manage what you host",
    description: "Easily modify event dates, revise locations, or cancel initiatives when ground logistics change, all from your organizer portal.",
    href: "/manage-events",
    action: "Manage events",
  },
  {
    step: "04",
    icon: BookmarkCheck,
    title: "Your civic portfolio",
    description: "Stay organized with a unified timeline of all community actions you have committed to attend, with easy attendance and volunteer schedule management.",
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
            badge="How HateyHat Works"
            title="Grassroots organizing, made frictionless"
            subtitle="Built to empower everyday citizens, students, and neighborhood groups across Dhaka to step up and build lasting social impact."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between p-7 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-xs">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-2xl font-black font-heading text-muted-foreground/30 tabular-nums group-hover:text-primary/40 transition-colors">
                      {feature.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
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
