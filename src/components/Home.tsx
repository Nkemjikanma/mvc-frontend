import { useTopCasts } from "@/lib/hooks/useTopCasts";
import type { SortField, SortOrder } from "@/lib/types";
import { getPopularityScore } from "@/lib/utils";
import type { Context } from "@farcaster/frame-sdk";
import { ArrowDownUp, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { CastCard } from "./CastCard";
// import { CastSkeleton } from "./CastsSkeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function Home({
    context,
}: {
    context: Context.FrameContext | undefined;
}) {
    const [sortBy, setSortBy] = useState<SortField>("default");
    const [order, setOrder] = useState<SortOrder>("desc");
    const { data, isLoading, error } = useTopCasts(context?.user.fid || 405941);
    const searchParams = new URLSearchParams(window.location.search);
    for (const [k, v] of searchParams) {
        console.log(k, v);
    }

    const sortedCasts = useMemo(() => {
        if (!data?.casts) return [];

        return [...data.casts].sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "likes":
                    comparison =
                        (a.reactions?.likes_count || 0) -
                        (b.reactions?.likes_count || 0);
                    break;
                case "recasts":
                    comparison =
                        (a.reactions?.recasts_count || 0) -
                        (b.reactions?.recasts_count || 0);
                    break;
                case "replies":
                    comparison =
                        (a.replies?.count || 0) - (b.replies?.count || 0);
                    break;
                default:
                    comparison = getPopularityScore(a) - getPopularityScore(b);
                    break;
            }

            return order === "asc" ? comparison : -comparison;
        });
    }, [data?.casts, sortBy, order]);

    const toggleSortOrder = () => {
        setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    const handleSortByChange = (value: SortField) => {
        setSortBy(value);
    };

    // Take only the top 20
    const topCasts = sortedCasts.slice(0, 20);

    return (
        <main className="relative flex flex-col min-h-screen w-full border items-center bg-white text-black dark:bg-black dark:text-white p-4">
            <header className="text-center mb-8">
                <p className="text-4xl font-black mb-2">M.V.C.</p>
                <p className="text-muted-foreground">
                    Quick view of you best performing casts.
                </p>
            </header>

            <div className="flex flex-col relative w-full rounded-none justify-end mb-6 gap-5">
                <div className="relative w-full flex flex-row items-center justify-between">
                    <div className="relative flex flex-rol w-fit h-fit gap-3 items-center">
                        <button
                            type="button"
                            onClick={toggleSortOrder}
                            className="bg-black relative flex w-fit h-fit p-2 items-center"
                        >
                            <ArrowDownUp className="w-3 h-3" />
                        </button>
                        {order}
                    </div>

                    <Select
                        onValueChange={(value) =>
                            handleSortByChange(value as SortField)
                        }
                        value={sortBy}
                    >
                        <SelectTrigger className="w-[180px] text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default" className="text-xs">
                                default
                            </SelectItem>
                            <SelectItem value="likes" className="text-xs">
                                Likes
                            </SelectItem>
                            <SelectItem value="recasts" className="text-xs">
                                Recasts
                            </SelectItem>
                            <SelectItem value="replies" className="text-xs">
                                Replies
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full max-w-lg">
                    {/* Loading and error states remain the same */}

                    {!isLoading && !error && sortedCasts.length > 0 ? (
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground px-2">
                                <span>
                                    Showing {sortedCasts.length} of{" "}
                                    {data?.meta?.total || sortedCasts.length}{" "}
                                    casts
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Since
                                    Tuesday
                                </span>
                            </div>

                            {topCasts.map((cast, index) => (
                                <CastCard
                                    key={cast.hash}
                                    cast={cast}
                                    index={index}
                                    sortBy={sortBy}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <p className="text-muted-foreground">
                                No casts found since Tuesday
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
