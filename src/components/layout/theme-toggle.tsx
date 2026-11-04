"use client";

import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative size-10 rounded-full hover:bg-muted active:scale-[0.96] transition-transform cursor-pointer"
    >
      <Sun className="size-5 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] scale-100 opacity-100 dark:scale-[0.25] dark:opacity-0 rotate-0 dark:-rotate-90" />
      <Moon className="absolute size-5 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] scale-[0.25] opacity-0 rotate-90 dark:rotate-0 dark:scale-100 dark:opacity-100" />
    </Button>
  );
}
