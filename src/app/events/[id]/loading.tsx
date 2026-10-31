import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <Skeleton className="w-full aspect-21/9 rounded-xl mb-8" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-32 w-full mt-6" />
        <Skeleton className="h-11 w-36 mt-4" />
      </div>
    </div>
  );
}
