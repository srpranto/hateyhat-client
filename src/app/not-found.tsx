import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass } from "lucide-react";

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
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
          className:
            "h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl font-semibold text-xs shadow-xs",
        })}
      >
        Back to Home
      </Link>
    </div>
  );
}
