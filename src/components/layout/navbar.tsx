"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { AUTH_TOAST_KEY } from "./social-login-toast";
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
      window.addEventListener("focus", handleAuthUpdate);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-session-change", handleAuthUpdate);
        window.removeEventListener("storage", handleAuthUpdate);
        window.removeEventListener("focus", handleAuthUpdate);
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
        sessionStorage.setItem(AUTH_TOAST_KEY, "You have been logged out.");
        window.dispatchEvent(new Event("auth-session-change"));
        window.location.href = window.location.origin;
      } else {
        toast.success("You have been logged out.");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="size-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              হ
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading leading-tight">
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
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150",
                isEventsActive
                  ? "bg-primary/15 text-foreground font-semibold ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
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
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "h-9 px-3.5 border-border rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-muted active:scale-[0.97] transition-all",
              })}
            >
              <CalendarPlus className="size-3.5 text-primary" />
              <span>Host Event</span>
            </Link>
          )}
          <ThemeToggle />
          {isPending ? (
            <Skeleton className="h-9 w-20 rounded-lg" />
          ) : session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={loginHref}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-muted-foreground hover:text-foreground font-semibold text-xs",
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
                    "h-9 px-4 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all font-semibold text-xs shadow-xs rounded-xl",
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
                  className="size-9 active:scale-[0.96] transition-transform rounded-lg"
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
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                  <Skeleton className="h-10 w-full rounded-lg" />
                ) : session ? (
                  <Button
                    variant="outline"
                    onClick={handleMobileLogout}
                    className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 rounded-lg"
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
                        className: "w-full bg-primary text-primary-foreground hover:opacity-90 rounded-lg",
                      })}
                    >
                      Login
                    </Link>
                    <Link
                      href={registerHref}
                      onClick={() => setMobileOpen(false)}
                      className={buttonVariants({
                        variant: "outline",
                        className: "w-full rounded-lg",
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
