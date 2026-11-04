import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      <div className="mb-6">
        <Skeleton className="h-4 w-48 rounded-md" />
      </div>
      <Skeleton className="w-full aspect-16/9 sm:aspect-21/9 rounded-3xl mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="border-t border-b border-border/70 py-8 space-y-3">
            <Skeleton className="h-6 w-52 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-5">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
