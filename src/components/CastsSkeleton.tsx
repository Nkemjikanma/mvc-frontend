import { Skeleton } from "@/components/ui/skeleton";

export function CastSkeleton() {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 overflow-hidden shadow-sm">
            <div className="flex items-start gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-3" />
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-4/5 h-4" />
                <Skeleton className="w-2/3 h-4" />
            </div>

            <div className="flex justify-between">
                <div className="flex gap-3">
                    <Skeleton className="w-12 h-4" />
                    <Skeleton className="w-12 h-4" />
                    <Skeleton className="w-12 h-4" />
                </div>
                <Skeleton className="w-20 h-4" />
            </div>
        </div>
    );
}
