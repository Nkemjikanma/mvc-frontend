import { useQuery } from "@tanstack/react-query";
import type { CastResponse } from "../types";

const server = "http://localhost:8787";

const getUserCasts = async (
    fid?: number,
    options?: {
        sortBy?: string;
        order?: string;
    },
): Promise<CastResponse> => {
    if (!fid) {
        throw new Error("No fid");
    }
    try {
        const queryParams = new URLSearchParams();
        if (options?.order) {
            queryParams.set("order", options.order);
        }
        if (options?.sortBy) {
            queryParams.set("sortBy", options.sortBy);
        }
        const response = await fetch(
            `${server}/${fid}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
        );

        if (!response.ok) {
            throw new Error("Failed to fetch casts");
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Error fetching casts:", e);
        throw e instanceof Error ? e : new Error(String(e));
    }
};

export const useTopCasts = (
    fid?: number,
    options?: {
        sortBy?: string;
        order?: string;
    },
) => {
    return useQuery({
        queryKey: ["topCasts", fid, options?.sortBy, options?.order],
        queryFn: () => getUserCasts(fid, options),
        staleTime: 3000,
        enabled: !!fid,
    });
};
