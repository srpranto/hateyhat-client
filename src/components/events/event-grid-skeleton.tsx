import { Skeleton } from "@/components/ui/skeleton";

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((key) => (
        <div
          key={key}
          className="flex flex-col h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs"
        >
          <Skeleton className="w-full aspect-video" />
          <div className="flex flex-col flex-1 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
