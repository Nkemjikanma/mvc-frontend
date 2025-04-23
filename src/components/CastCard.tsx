import type { Cast, Embed, SortField } from "@/lib/types";
import { isCastEmbed, isImageEmbed, isOpenGraphEmbed } from "@/lib/utils";
import { MessageSquare, Repeat, Reply, ThumbsUp } from "lucide-react";
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
    const isReply = !!cast.parent_hash;

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
            className={`rounded-lg border ${
                isReply
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-gray-200 dark:border-gray-800"
            } bg-white dark:bg-gray-950 overflow-hidden shadow-sm`}
        >
            {isReply && (
                <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-1 flex items-center text-xs text-blue-600 dark:text-blue-400">
                    <Reply className="h-3 w-3 mr-1" />
                    <span>Reply to another cast</span>
                </div>
            )}
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

                {/* Show parent cast if this is a reply */}
                {/* {isReply && cast.parent_author?.fid && (
                <div className="mb-3 ml-2 pl-3 border-l-2 border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">
                        Replying to @{cast.parent_author. || "user"}
                    </p>
                </div>
            )} */}
                <p className="px-4 dark:bg-gray-950 text-sm mb-3 whitespace-pre-wrap">
                    {cast.text}
                </p>

                {cast.embeds && cast.embeds.length > 0 && (
                    <div className="px-4 mt-2 mb-3">
                        {cast.embeds.map((embed: Embed, i: number) => {
                            console.log("embed data", embed);
                            if (isImageEmbed(embed)) {
                                // It's a direct image
                                return (
                                    <div
                                        key={index}
                                        className="rounded-md overflow-hidden"
                                    >
                                        <img
                                            src={embed.url}
                                            alt="embed"
                                            className="w-full max-h-80 object-contain"
                                        />
                                    </div>
                                );
                            }

                            if (isOpenGraphEmbed(embed)) {
                                return (
                                    <div
                                        key={`og-${i}`}
                                        className="rounded-md overflow-hidden border"
                                    >
                                        {embed.metadata.html.ogImage?.length >
                                            0 && (
                                            <img
                                                src={
                                                    embed.metadata.html
                                                        .ogImage[0].url
                                                }
                                                alt="Preview"
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-2">
                                            <h3 className="font-medium">
                                                {embed.metadata.html.ogTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {
                                                    embed.metadata.html
                                                        .ogDescription
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            }

                            if (isCastEmbed(embed)) {
                                return (
                                    <div
                                        key={`cast-${i}`}
                                        className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900/50"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <img
                                                src={embed.cast.author.pfp_url}
                                                alt={
                                                    embed.cast.author
                                                        .display_name
                                                }
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span className="text-xs font-medium">
                                                {embed.cast.author.display_name}{" "}
                                                (@
                                                {embed.cast.author.username})
                                            </span>
                                        </div>
                                        <p className="text-sm">
                                            {embed.cast.text}
                                        </p>

                                        {/* Render any images in the embedded cast */}
                                        {embed.cast.embeds?.length > 0 &&
                                            embed.cast.embeds[0].url && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            embed.cast.embeds[0]
                                                                .url
                                                        }
                                                        alt="Embedded image"
                                                        className="max-h-40 rounded-md object-cover"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                );
                            }

                            // if (isCastEmbed(embed)) {
                            //     return (
                            //         <div
                            //             key={i}
                            //             className="rounded-md border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900/50 text-xs"
                            //         >
                            //             <p className="font-medium">
                            //                 @
                            //                 {embed.cast.author?.username ||
                            //                     "user"}
                            //                 wrote:
                            //             </p>
                            //             <p className="mt-1 line-clamp-2">
                            //                 {embed.cast.text}
                            //             </p>
                            //         </div>
                            //     );
                            // }

                            // Add other embed types as needed based on your actual data
                            return null;
                        })}
                    </div>
                )}
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
        </motion.div>
    );
};
