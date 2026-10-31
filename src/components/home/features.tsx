import { SectionHeading } from "@/components/shared/section-heading";
import { CalendarPlus, CheckCircle2, Settings2, BookmarkCheck } from "lucide-react";

const FEATURES = [
  {
    icon: CalendarPlus,
    title: "Host in minutes",
    description: "Launch community drives, cleanups, or emergency relief events with simple details and clear locations.",
  },
  {
    icon: CheckCircle2,
    title: "Join with one click",
    description: "Support local neighborhood efforts and sign up as a volunteer or donor without friction.",
  },
  {
    icon: Settings2,
    title: "Manage what you host",
    description: "Easily modify event dates, revise locations, or cancel initiatives when ground logistics change.",
  },
  {
    icon: BookmarkCheck,
    title: "Keep track of what you joined",
    description: "Stay organized with a unified timeline of all community actions you have committed to attend.",
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading
            badge="How it works"
            title="Grassroots organizing made simple"
            subtitle="Built to connect everyday citizens and local leaders across Dhaka to take collective action."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col p-6 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
