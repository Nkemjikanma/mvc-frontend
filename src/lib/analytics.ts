import type { Cast } from "./types";
import { getPopularityScore } from "./utils";

// type DayOfWeekCountsType = {};

export const analyseTimings = (casts: Cast[]) => {
    const dayOfWeekCounts: Record<
        number,
        { count: number; engagement: number }
    > = {
        0: { count: 0, engagement: 0 }, // Sunday
        1: { count: 0, engagement: 0 }, // Monday
        2: { count: 0, engagement: 0 }, // Tuesday
        3: { count: 0, engagement: 0 }, // Wednesday
        4: { count: 0, engagement: 0 }, // Thursday
        5: { count: 0, engagement: 0 }, // Friday
        6: { count: 0, engagement: 0 }, // Saturday
    };

    const hourCounts = Array(24)
        .fill(null)
        .map(() => ({ count: 0, engagement: 0 }));

    for (const cast of casts) {
        const date = new Date(cast.timestamp);
        const dayOfWeek = date.getDay();
        const hour = date.getHours();

        const engagement = getPopularityScore(cast);

        dayOfWeekCounts[dayOfWeek].count++;
        dayOfWeekCounts[dayOfWeek].engagement += engagement;

        hourCounts[hour].count++;
        hourCounts[hour].engagement += engagement;
    }
};
