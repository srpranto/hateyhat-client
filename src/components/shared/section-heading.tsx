import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {badge && (
        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium tracking-wide">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}
