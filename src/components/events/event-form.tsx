"use client";

import { useState, type FormEvent } from "react";
import { EVENT_TYPES, isEventType } from "@/lib/constants";
import { formatEventDate, getTomorrowDhakaDate } from "@/lib/date";
import { validateEventFormData, normalizeImageUrl } from "@/lib/validation";
import type { EventFormData, EventFormErrors } from "@/types/event";
import { EventThumbnail } from "./event-thumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "cn";

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
  isUpdate?: boolean;
  existingDate?: string;
}

export function EventForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
  isUpdate = false,
  existingDate,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    thumbnail: initialData?.thumbnail || "",
    eventType: initialData?.eventType || "Cleanup",
    eventDate: initialData?.eventDate || "",
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<EventFormErrors>({});

  const minDate = getTomorrowDhakaDate();
  const minParts = minDate.split("-");
  const defaultCalendarMonth = new Date(
    Number(minParts[0]),
    Number(minParts[1]) - 1,
    1
  );

  const selectedDate = (() => {
    if (!formData.eventDate) return undefined;
    const parts = formData.eventDate.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  })();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedThumbnail = normalizeImageUrl(formData.thumbnail);
    const dataToValidate: EventFormData = {
      ...formData,
      thumbnail: normalizedThumbnail,
    };

    const validation = validateEventFormData(dataToValidate, isUpdate, existingDate);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fill in all fields correctly.");
      return;
    }

    if (normalizedThumbnail !== formData.thumbnail) {
      setFormData((prev) => ({ ...prev, thumbnail: normalizedThumbnail }));
    }

    setErrors({});
    await onSubmit(dataToValidate);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="event-title" className="text-sm font-medium">
          Event Title
        </Label>
        <Input
          id="event-title"
          type="text"
          placeholder="Winter Clothes Distribution at Mirpur"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          disabled={isSubmitting}
          className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.title && (
          <p className="text-xs text-destructive mt-1 font-medium">{errors.title}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="event-type" className="text-sm font-medium">
          Event Category
        </Label>
        <Select
          value={formData.eventType}
          onValueChange={(val) => {
            if (isEventType(val)) {
              setFormData((prev) => ({ ...prev, eventType: val }));
            }
          }}
          disabled={isSubmitting}
        >
          <SelectTrigger id="event-type" className="w-full">
            <SelectValue placeholder="Select event category" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventType && (
          <p className="text-xs text-destructive mt-1 font-medium">{errors.eventType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="event-date" className="text-sm font-medium">
            Event Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              render={
                <Button
                  id="event-date"
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 px-3",
                    !formData.eventDate && "text-muted-foreground",
                    errors.eventDate && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              }
            >
              <CalendarIcon className="mr-2 size-4 text-primary shrink-0" />
              {formData.eventDate ? (
                <span>{formatEventDate(formData.eventDate)}</span>
              ) : (
                <span className="text-muted-foreground">Select event date</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                required
                selected={selectedDate}
                defaultMonth={selectedDate || defaultCalendarMonth}
                onSelect={(day) => {
                  if (day) {
                    const y = day.getFullYear();
                    const m = String(day.getMonth() + 1).padStart(2, "0");
                    const d = String(day.getDate()).padStart(2, "0");
                    setFormData((prev) => ({
                      ...prev,
                      eventDate: `${y}-${m}-${d}`,
                    }));
                    setErrors((prev) => ({ ...prev, eventDate: undefined }));
                    setCalendarOpen(false);
                  }
                }}
                disabled={(day) => {
                  const y = day.getFullYear();
                  const m = String(day.getMonth() + 1).padStart(2, "0");
                  const d = String(day.getDate()).padStart(2, "0");
                  const dateStr = `${y}-${m}-${d}`;
                  if (isUpdate && existingDate && dateStr === existingDate) {
                    return false;
                  }
                  return dateStr < minDate;
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.eventDate && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.eventDate}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="event-location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="event-location"
            type="text"
            placeholder="Mirpur 10 Circle, Dhaka"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            disabled={isSubmitting}
            className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.location && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="event-thumbnail" className="text-sm font-medium">
            Thumbnail Image URL
          </Label>
          <span className="text-[11px] text-muted-foreground">Direct image link (jpg, png, webp)</span>
        </div>
        <Input
          id="event-thumbnail"
          type="text"
          inputMode="url"
          placeholder="https://images.unsplash.com/photo-... or https://unsplash.com/photos/..."
          value={formData.thumbnail}
          onChange={(e) => {
            const val = e.target.value;
            setFormData((prev) => ({ ...prev, thumbnail: val }));
            if (errors.thumbnail) {
              setErrors((prev) => ({ ...prev, thumbnail: undefined }));
            }
          }}
          onBlur={(e) => {
            const normalized = normalizeImageUrl(e.target.value);
            if (normalized !== e.target.value) {
              setFormData((prev) => ({ ...prev, thumbnail: normalized }));
            }
          }}
          disabled={isSubmitting}
          className={errors.thumbnail ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.thumbnail && (
          <p className="text-xs text-destructive mt-1 font-medium">{errors.thumbnail}</p>
        )}

        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-muted-foreground mr-1">Presets:</span>
          {[
            { label: "Tree Plantation", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80" },
            { label: "Cleanup", url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80" },
            { label: "Winter Clothes", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" },
            { label: "Food Drive", url: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80" },
            { label: "Health Camp", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80" },
          ].map((preset) => (
            <button
              type="button"
              key={preset.label}
              onClick={() => {
                setFormData((prev) => ({ ...prev, thumbnail: preset.url }));
                setErrors((prev) => ({ ...prev, thumbnail: undefined }));
              }}
              className="px-2 py-0.5 rounded-md text-[11px] bg-muted/80 hover:bg-primary/10 hover:text-primary border border-border/70 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {formData.thumbnail.trim() ? (
          <div className="rounded-[20px] border border-border/80 overflow-hidden bg-card/60 p-3 space-y-2 mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Live Thumbnail Preview</span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[240px] tabular-nums">
                {formData.thumbnail}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-border/60 aspect-video max-h-52 bg-muted/60">
              <EventThumbnail
                src={normalizeImageUrl(formData.thumbnail)}
                alt="Live event thumbnail preview"
                aspectClassName="aspect-video"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="event-description" className="text-sm font-medium">
          Event Description
        </Label>
        <Textarea
          id="event-description"
          rows={4}
          placeholder="Describe your initiative, goals, requirements for volunteers, and contact details..."
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          disabled={isSubmitting}
          className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1 font-medium">{errors.description}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.96] transition-transform font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
