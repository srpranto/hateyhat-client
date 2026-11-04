"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "hateyhat-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") {
        queueMicrotask(() => {
          setThemeState(saved);
        });
      }
    } catch {
      // ignore
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    queueMicrotask(() => {
      setSystemPrefersDark(media.matches);
    });
    const listener = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);
  const resolvedTheme: ResolvedTheme = isDark ? "dark" : "light";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const setTheme = (newTheme: Theme) => {
    const applyTheme = () => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // ignore localStorage access issues in sandbox/private modes
      }
      const root = document.documentElement;
      const targetIsDark = newTheme === "dark" || (newTheme === "system" && systemPrefersDark);
      if (targetIsDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (typeof document === "undefined") {
      applyTheme();
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Use native View Transitions API if supported and motion is allowed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    if (!prefersReducedMotion && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        applyTheme();
      });
      return;
    }

    // Fallback: apply temporary theme-transitioning class for coordinated CSS transitions
    if (!prefersReducedMotion) {
      document.documentElement.classList.add("theme-transitioning");
      applyTheme();
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 300);
      return;
    }

    applyTheme();
  };

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isCurrentlyDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "system",
      resolvedTheme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
