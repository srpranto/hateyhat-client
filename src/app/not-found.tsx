import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-6">
        <Compass className="size-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-heading mb-4">
        Page not found
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md mb-8">
        The community page or event you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
          className:
            "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform",
        })}
      >
        Back to {SITE_NAME} Home
      </Link>
    </div>
  );
}
