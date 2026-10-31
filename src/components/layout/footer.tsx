import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { XLogo } from "@/components/icons/x-logo";
import { FacebookLogo, InstagramLogo, LinkedInLogo } from "@/components/icons/social-icons";
import { Mail, MapPin, Phone, HeartHandshake } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border/80 bg-card text-card-foreground mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="mb-14 border-b border-border/70 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                <HeartHandshake className="size-3.5" />
                <span>হাতে হাত • Community In Action</span>
              </div>
              <div className="text-4xl sm:text-6xl font-black tracking-tight text-foreground font-heading">
                {SITE_NAME}
              </div>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl text-pretty">
                {SITE_TAGLINE} — Grassroots civic action connecting neighbours across Dhaka to organize relief drives, cleanups, and local change.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
              <span>Active across 8 Dhaka zones</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-14">
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-foreground mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Upcoming Initiatives
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-primary transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-primary transition-colors">
                  Volunteer Timeline
                </Link>
              </li>
              <li>
                <Link href="/manage-events" className="hover:text-primary transition-colors">
                  Organizer Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-foreground mb-4">
              Community Hubs
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
              <li>Mirpur 10 Circle</li>
              <li>Dhanmondi Lakefront</li>
              <li>Sadarghat Launch Terminal</li>
              <li>Karwan Bazar Civic Point</li>
              <li>Korail Slum Community Hub</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-foreground mb-4">
              Dhaka Secretariat
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="leading-relaxed">House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>contact@hateyhat.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+880 1712-345678</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-foreground mb-4">
              Connect & Volunteer
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Stay in touch with grassroots organizers and community updates.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center size-9 rounded-xl bg-muted/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <FacebookLogo className="size-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex items-center justify-center size-9 rounded-xl bg-muted/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <XLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center size-9 rounded-xl bg-muted/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <InstagramLogo className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center size-9 rounded-xl bg-muted/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <LinkedInLogo className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/70 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{`© ${currentYear} ${SITE_NAME}. All rights reserved.`}</p>
          <p>Built for the people of Dhaka with Next.js App Router & Express.</p>
        </div>
      </div>
    </footer>
  );
}
