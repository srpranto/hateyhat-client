"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Menu, CalendarDays, CalendarPlus, CalendarCheck, User, LogOut } from "lucide-react";
import { cn } from "cn";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending, refetch } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleAuthUpdate = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void refetch();
        router.refresh();
      }, 50);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("auth-session-change", handleAuthUpdate);
      window.addEventListener("storage", handleAuthUpdate);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-session-change", handleAuthUpdate);
        window.removeEventListener("storage", handleAuthUpdate);
      }
    };
  }, [refetch, router]);

  const currentRedirectTarget =
    pathname &&
    pathname !== "/" &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register")
      ? pathname
      : null;

  const loginHref = currentRedirectTarget
    ? `/login?redirect=${encodeURIComponent(currentRedirectTarget)}`
    : "/login";

  const registerHref = currentRedirectTarget
    ? `/register?redirect=${encodeURIComponent(currentRedirectTarget)}`
    : "/register";

  const isEventsActive = pathname === "/events";

  const handleMobileLogout = async () => {
    try {
      setMobileOpen(false);
      await signOut();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-session-change"));
      }
      toast.success("You have been logged out.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/75 transition-colors duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            title="হাতে হাত • HateyHat — Community Initiatives Dhaka"
            className="flex items-center gap-2.5 group"
          >
            <div className="size-8.5 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:shadow-sm group-hover:shadow-primary/30 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
              হ
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading leading-tight group-hover:text-primary transition-colors duration-200 ease-out">
                {SITE_NAME}
              </span>
              <span className="text-[10px] text-muted-foreground font-serif leading-none tracking-wide">
                হাতে হাত
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/events"
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ease-out active:scale-[0.97]",
                isEventsActive
                  ? "bg-primary/15 text-primary font-bold ring-1 ring-primary/30 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              Upcoming Events
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session && (
            <Link
              href="/create-event"
              title="Host a new community initiative in Dhaka"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "h-9 px-3.5 border-border/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-muted hover:border-primary/40 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              })}
            >
              <CalendarPlus className="size-3.5 text-primary" />
              <span>Host Event</span>
            </Link>
          )}
          <ThemeToggle />
          {isPending ? (
            <Skeleton className="h-9 w-20 rounded-xl" />
          ) : session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={loginHref}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-[0.96] font-semibold text-xs rounded-xl transition-all duration-200 ease-out",
                })}
              >
                Login
              </Link>
              <Link
                href={registerHref}
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                  className:
                    "h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm hover:shadow-primary/25 active:scale-[0.96] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-semibold text-xs shadow-xs rounded-xl",
                })}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 min-w-10 min-h-10 active:scale-[0.96] transition-transform rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] p-6 flex flex-col justify-between bg-card/95 backdrop-blur-md">
              <div>
                <SheetHeader className="p-0 mb-6 text-left">
                  <SheetTitle className="text-xl font-bold font-heading flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>{SITE_NAME}</span>
                  </SheetTitle>
                </SheetHeader>

                {isPending ? (
                  <div className="space-y-3 mb-6">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ) : session ? (
                  <div className="mb-6 p-3 rounded-xl bg-muted/60 border border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm ring-1 ring-primary/30">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold truncate text-foreground">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <nav className="flex flex-col gap-1.5">
                  <Link
                    href="/events"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                      isEventsActive
                        ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <CalendarDays className="size-4 text-primary" />
                    <span>Upcoming Events</span>
                  </Link>

                  {session && (
                    <>
                      <Link
                        href="/create-event"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                          pathname === "/create-event"
                            ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        )}
                      >
                        <CalendarPlus className="size-4 text-primary" />
                        <span>Create Event</span>
                      </Link>
                      <Link
                        href="/manage-events"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                          pathname === "/manage-events"
                            ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        )}
                      >
                        <CalendarDays className="size-4 text-primary" />
                        <span>Manage Events</span>
                      </Link>
                      <Link
                        href="/joined-events"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                          pathname === "/joined-events"
                            ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        )}
                      >
                        <CalendarCheck className="size-4 text-primary" />
                        <span>Joined Events</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                          pathname === "/profile"
                            ? "bg-primary/15 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        )}
                      >
                        <User className="size-4 text-primary" />
                        <span>Profile</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              <div className="pt-6 border-t border-border/70">
                {isPending ? (
                  <Skeleton className="h-10 w-full rounded-xl" />
                ) : session ? (
                  <Button
                    variant="outline"
                    onClick={handleMobileLogout}
                    className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/25 hover:bg-destructive/10 rounded-xl active:scale-[0.98] transition-all duration-200 ease-out"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={loginHref}
                      onClick={() => setMobileOpen(false)}
                      className={buttonVariants({
                        variant: "default",
                        className:
                          "w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-semibold text-xs rounded-xl shadow-xs",
                      })}
                    >
                      Login
                    </Link>
                    <Link
                      href={registerHref}
                      onClick={() => setMobileOpen(false)}
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "w-full h-11 border-border/80 rounded-xl text-xs font-semibold hover:bg-muted hover:border-primary/40 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      })}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
