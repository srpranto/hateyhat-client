"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/types/event";
import { EVENT_TYPES, type EventType } from "@/lib/constants";
import { EventGrid } from "./event-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";

type SortOption = "date-asc" | "date-desc" | "title-asc" | "title-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "date-asc": "Date: Soonest First",
  "date-desc": "Date: Latest First",
  "title-asc": "Title: A to Z",
  "title-desc": "Title: Z to A",
};

interface EventsExplorerProps {
  initialEvents: EventItem[];
}

export function EventsExplorer({ initialEvents }: EventsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date-asc");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialEvents.length };
    for (const event of initialEvents) {
      counts[event.eventType] = (counts[event.eventType] || 0) + 1;
    }
    return counts;
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    let result = [...initialEvents];

    if (selectedCategory !== "ALL") {
      result = result.filter((event) => event.eventType === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return a.eventDate.localeCompare(b.eventDate);
      }
      if (sortBy === "date-desc") {
        return b.eventDate.localeCompare(a.eventDate);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [initialEvents, searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedCategory !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSortBy("date-asc");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-11 bg-background border-border rounded-xl text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:scale-110 active:scale-90 transition-all p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground shrink-0">
              <SlidersHorizontal className="size-3.5" />
              <span>Sort:</span>
            </div>
            <Select
              value={sortBy}
              onValueChange={(val) => {
                if (
                  val === "date-asc" ||
                  val === "date-desc" ||
                  val === "title-asc" ||
                  val === "title-desc"
                ) {
                  setSortBy(val);
                }
              }}
            >
              <SelectTrigger className="flex-1 md:w-[190px] h-11 bg-background border-border rounded-xl text-xs font-medium">
                <SelectValue placeholder="Sort events">
                  {SORT_LABELS[sortBy]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card">
                <SelectItem value="date-asc">Date: Soonest First</SelectItem>
                <SelectItem value="date-desc">Date: Latest First</SelectItem>
                <SelectItem value="title-asc">Title: A to Z</SelectItem>
                <SelectItem value="title-desc">Title: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-11 px-3 border-border rounded-xl text-xs flex items-center gap-1.5 shrink-0 hover:border-primary/40 active:scale-[0.96] transition-all"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
              selectedCategory === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold ring-1 ring-primary/40"
                : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums transition-colors duration-200 ease-out ${
                selectedCategory === "ALL"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background text-muted-foreground"
              }`}
            >
              {categoryCounts.ALL || 0}
            </span>
          </button>

          {EVENT_TYPES.map((cat: EventType) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.96] cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold ring-1 ring-primary/40"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums transition-colors duration-200 ease-out ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          <span>Showing </span>
          <strong className="font-semibold text-foreground tabular-nums">{filteredEvents.length}</strong>
          <span> of </span>
          <strong className="font-semibold text-foreground tabular-nums">{initialEvents.length}</strong>
          <span> events</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors duration-150 cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Search className="size-6" />
          </div>
          <h3 className="text-lg font-bold font-heading text-foreground mb-1">
            No events found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
            No events match your current search or category filter. Try refining your keywords or resetting your filters.
          </p>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="rounded-xl flex items-center gap-2"
          >
            <RotateCcw className="size-4" />
            <span>Reset filters</span>
          </Button>
        </div>
      ) : (
        <EventGrid events={filteredEvents} />
      )}
    </div>
  );
}
