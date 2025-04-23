import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CastEmbedded, Embed } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Avoid refetching on focus
            staleTime: 5 * 60 * 1000, // 5 minutes stale time
        },
    },
});

export default queryClient;

export function isImageEmbed(
    embed: Embed,
): embed is Extract<Embed, { metadata: { image: any } }> {
    return "url" in embed && "metadata" in embed && "image" in embed.metadata;
}

export function isOpenGraphEmbed(
    embed: Embed,
): embed is Extract<Embed, { metadata: { html: any } }> {
    return "url" in embed && "metadata" in embed && "html" in embed.metadata;
}

export function isCastEmbed(embed: Embed): embed is Extract<
    Embed,
    {
        cast_id: {
            fid: number;
            hash: string;
        };
        cast: CastEmbedded;
    }
> {
    return "cast_id" in embed && "cast" in embed;
}

export const getPopularityScore = (cast: Cast) => {
    const likesCount = cast.reactions?.likes_count || 0;
    const recastsCount = cast.reactions?.recasts_count || 0;
    const repliesCount = cast.replies?.count || 0;

    // Weighted popularity score -
    return likesCount + recastsCount * 1.2 + repliesCount;
};
