"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { normalizeImageUrl } from "@/lib/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { AUTH_TOAST_KEY } from "./social-login-toast";
import { CalendarPlus, CalendarCheck, CalendarDays, LogOut, User } from "lucide-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
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

  const displayName = user.name || "User";
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="size-9 rounded-full ring-2 ring-border/80 hover:ring-primary/50 focus:outline-hidden focus:ring-2 focus:ring-primary transition-all cursor-pointer overflow-hidden"
                    aria-label={`Open user menu for ${displayName}`}
                  >
                    <Avatar className="size-9">
                      {user.image && <AvatarImage src={normalizeImageUrl(user.image)} alt={displayName} />}
                      <AvatarFallback className="bg-primary/15 text-primary font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
            }
          />
          <TooltipContent side="bottom" sideOffset={8}>
            <p className="text-xs font-medium">{displayName}</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md shadow-lg">
          <div className="px-2.5 py-2 mb-1 rounded-lg bg-muted/40">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <Link href="/create-event" className="flex items-center gap-2.5 cursor-pointer rounded-lg text-sm" />
            }
          >
            <CalendarPlus className="size-4 text-primary shrink-0" />
            <span>Create Event</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link href="/manage-events" className="flex items-center gap-2.5 cursor-pointer rounded-lg text-sm" />
            }
          >
            <CalendarDays className="size-4 text-primary shrink-0" />
            <span>Manage Events</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link href="/joined-events" className="flex items-center gap-2.5 cursor-pointer rounded-lg text-sm" />
            }
          >
            <CalendarCheck className="size-4 text-primary shrink-0" />
            <span>Joined Events</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer rounded-lg text-sm" />
            }
          >
            <User className="size-4 text-primary shrink-0" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2.5 text-destructive focus:text-destructive cursor-pointer rounded-lg text-sm"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="inline-flex text-muted-foreground hover:text-foreground text-xs rounded-lg"
      >
        Logout
      </Button>
    </div>
  );
}
