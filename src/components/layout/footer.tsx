import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { XLogo } from "@/components/icons/x-logo";
import { FacebookLogo, InstagramLogo, LinkedInLogo } from "@/components/icons/social-icons";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-12 border-b border-border pb-8">
          <div className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground/90 font-heading">
            {SITE_NAME}
          </div>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {SITE_TAGLINE} — Empowering communities across Dhaka to initiate and join social change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              Contact Dhaka Office
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span>House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>contact@hateyhat.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+880 1712-345678</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground mb-4">
              Connect With Us
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow our community drives and grassroots updates across social networks.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center size-9 rounded-full bg-muted hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <FacebookLogo className="size-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex items-center justify-center size-9 rounded-full bg-muted hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <XLogo className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center size-9 rounded-full bg-muted hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <InstagramLogo className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center size-9 rounded-full bg-muted hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <LinkedInLogo className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <p>Built with Next.js App Router, Express, and MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}
