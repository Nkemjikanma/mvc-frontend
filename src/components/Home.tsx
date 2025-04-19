import { useTopCasts } from "@/lib/hooks/useTopCasts";
import type { SortField, SortOrder } from "@/lib/types";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { ArrowDownUp, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CastCard } from "./CastCard";
import { CastSkeleton } from "./CastsSkeleton";
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
    const { data, isLoading, error, refetch } = useTopCasts(
        context?.user.fid || 405941,
        {
            sortBy,
            order,
        },
    );

    return (
        <main className="relative flex flex-col min-h-screen w-full border items-center bg-white text-black dark:bg-black dark:text-white p-4">
            <header className="text-center mb-8">
                <p className="text-4xl font-black mb-2">M.V.C.</p>
                <p className="text-muted-foreground">
                    View of your weekly casts that bring you the most value
                </p>
            </header>

            <div className="flex flex-col relative w-full rounded-none justify-end mb-6 gap-5">
                <div className="relative w-full flex flex-row items-center justify-between">
                    <div className="relative flex flex-rol w-fit h-fit gap-3 items-center">
                        <button
                            type="button"
                            onClick={() => {
                                if (order === "desc") {
                                    setOrder("asc");
                                } else {
                                    setOrder("desc");
                                }
                            }}
                            className="bg-black relative flex w-fit h-fit p-2 items-center"
                        >
                            <ArrowDownUp className="w-3 h-3" />
                        </button>
                        {order}
                    </div>

                    <Select>
                        <SelectTrigger className="w-[180px] text-xs">
                            <SelectValue placeholder="Filters" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="default"
                                onClick={() => setSortBy("default")}
                                className="text-xs"
                            >
                                default
                            </SelectItem>
                            <SelectItem
                                value="likes"
                                onClick={() => setSortBy("likes")}
                                className="text-xs"
                            >
                                Likes
                            </SelectItem>
                            <SelectItem
                                value="recasts"
                                onClick={() => setSortBy("recasts")}
                                className="text-xs"
                            >
                                Recasts
                            </SelectItem>
                            <SelectItem
                                value="replies"
                                onClick={() => setSortBy("replies")}
                                className="text-xs"
                            >
                                Recasts
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full max-w-lg">
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <CastSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-red-600 dark:text-red-400">
                                Error loading casts
                            </p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : data?.casts && data.casts.length > 0 ? (
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground px-2">
                                <span>
                                    Showing {data.casts.length} of {data.total}{" "}
                                    casts
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> Since
                                    Tuesday
                                </span>
                            </div>

                            {data.casts.map((cast, index) => (
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
