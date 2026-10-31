"use client";

import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Thank you for subscribing to our community bulletin.");
    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 bg-card border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="rounded-2xl bg-muted/50 border border-border p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-4">
            <Mail className="size-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-foreground mb-3 text-balance">
            Stay updated with local community causes
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mb-8 text-pretty">
            Receive bi-weekly notices of grassroots relief drives, medical camps, and cleanup initiatives in Dhaka directly in your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <div className="flex-1 text-left">
              <Label htmlFor="newsletter-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-background border-border"
              />
            </div>
            <Button
              type="submit"
              className="h-11 px-6 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform font-medium shrink-0"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Zero spam. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
}
