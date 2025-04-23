import { useQuery } from "@tanstack/react-query";
import type { CastResponse } from "../types";

const server = "http://localhost:8787";

const getUserCasts = async (fid?: number): Promise<CastResponse> => {
    if (!fid) {
        throw new Error("No fid");
    }
    try {
        const response = await fetch(`${server}/${fid}`);

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

export const useTopCasts = (fid?: number) => {
    return useQuery({
        queryKey: ["topCasts", fid],
        queryFn: () => getUserCasts(fid),
        staleTime: 3000,
        enabled: !!fid,
    });
};
