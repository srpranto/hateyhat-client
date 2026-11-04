"use client";

import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, CheckCircle, ShieldCheck } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribed(true);
    toast.success("Thank you for subscribing. We will keep you updated on upcoming events.");
    setEmail("");
  };

  return (
    <section className="py-20 md:py-28 bg-muted/30 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-primary/25 hover:border-primary/45 p-8 sm:p-14 text-center flex flex-col items-center shadow-xl transition-colors duration-300">
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/10 blur-2xl" />

          <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/15 text-primary mb-5 shadow-xs">
            <Mail className="size-7" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <span>Community Updates</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground mb-3 text-balance">
            Stay updated on community initiatives near you
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mb-8 text-pretty leading-relaxed">
            Receive timely updates about relief distribution, blood drives, and cleanups happening in your part of Dhaka.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-primary/10 text-foreground border border-primary/30">
              <CheckCircle className="size-5 text-primary shrink-0" />
              <span className="text-sm font-medium">You are subscribed! We will keep you posted on upcoming drives.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <div className="flex-1 text-left">
                <Label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border rounded-xl px-4 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-7 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-semibold rounded-xl shrink-0 shadow-md shadow-primary/20"
              >
                Subscribe
              </Button>
            </form>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>No spam. Unsubscribe at any time.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
