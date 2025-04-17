import { useQuery } from "@tanstack/react-query";

const getUserCasts = async () => {};

export const useTopCasts = (fid?: number) => {
    return useQuery({
        queryKey: ["topCasts", fid],
        queryFn: () => getUserCasts(),
        staleTime: 3000,
        enabled: !!fid,
    });
};
