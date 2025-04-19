import type { Cast, Embed, SortField } from "@/lib/types";
import { MessageSquare, Repeat, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";

export const CastCard = ({
    cast,
    index,
    sortBy,
}: {
    cast: Cast;
    index: number;
    sortBy: SortField;
}) => {
    const likesCount = cast.reactions?.likes_count || 0;
    const recastsCount = cast.reactions?.recasts_count || 0;
    const repliesCount = cast.replies?.count || 0;

    // Format timestamp to a readable format
    const formattedDate = new Date(cast.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const getHighlightClass = (type: SortField) => {
        if (sortBy === type || (sortBy === "default" && type === "default")) {
            return "text-purple-600 dark:text-purple-400 font-bold";
        }
        return "";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-sm"
        >
            <div className="p-4 w-11/12">
                <div className="flex items-start gap-3 mb-3">
                    {cast.author?.pfp_url && (
                        <img
                            src={cast.author.pfp_url}
                            alt={
                                cast.author.display_name || cast.author.username
                            }
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <div className="font-semibold">
                            {cast.author?.display_name || cast.author?.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            @{cast.author?.username}
                        </div>
                    </div>
                </div>
            </div>
            <p className="px-4 dark:bg-gray-950 text-sm mb-3 whitespace-pre-wrap">
                {cast.text}
            </p>

            {cast.embeds && cast.embeds.length > 0 && (
                <div className="px-4 mt-2 mb-3">
                    {cast.embeds.map((embed: Embed, i: number) => {
                        console.log("embed data", embed);
                        if (embed.url && embed.metadata?.html?.ogImage) {
                            return (
                                <div
                                    key={i}
                                    className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800"
                                >
                                    <img
                                        src={embed.url}
                                        alt={
                                            embed.metadata.html.ogTitle ||
                                            "Embedded content"
                                        }
                                        className="w-full h-48 object-cover"
                                    />
                                    {embed.metadata.html.ogTitle && (
                                        <div className="p-2 text-xs">
                                            <p className="font-medium line-clamp-1">
                                                {embed.metadata.html.ogUrl}
                                            </p>
                                            {embed.metadata.html
                                                .ogDescription && (
                                                <p className="text-muted-foreground line-clamp-2 mt-1">
                                                    {
                                                        embed.metadata.html
                                                            .ogDescription
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        if (embed) {
                            return (
                                <div
                                    key={i}
                                    className="rounded-md border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900/50 text-xs"
                                >
                                    <p className="font-medium">
                                        @
                                        {embed.cast?.author?.username || "user"}{" "}
                                        wrote:
                                    </p>
                                    <p className="mt-1 line-clamp-2">
                                        {embed.cast?.text}
                                    </p>
                                </div>
                            );
                        }
                        // Add other embed types as needed based on your actual data
                        return null;
                    })}

                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-4">
                        <div className="flex gap-4">
                            <div
                                className={`flex items-center gap-1 ${getHighlightClass("likes")}`}
                            >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>{likesCount}</span>
                            </div>
                            <div
                                className={`flex items-center gap-1 ${getHighlightClass("recasts")}`}
                            >
                                <Repeat className="h-3.5 w-3.5" />
                                <span>{recastsCount}</span>
                            </div>
                            <div
                                className={`flex items-center gap-1 ${getHighlightClass("replies")}`}
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>{repliesCount}</span>
                            </div>
                        </div>
                        <div>{formattedDate}</div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
