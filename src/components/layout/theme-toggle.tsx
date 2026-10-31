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
      className="relative size-10 rounded-full hover:bg-muted active:scale-[0.96] transition-transform"
    >
      <Sun className="size-5 transition-all duration-200 opacity-100 scale-100 dark:opacity-0 dark:scale-75" />
      <Moon className="absolute size-5 transition-all duration-200 opacity-0 scale-75 dark:opacity-100 dark:scale-100" />
    </Button>
  );
}
