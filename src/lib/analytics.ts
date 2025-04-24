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

    const hourCounts: {
        count: number;
        engagement: number;
    }[] = Array(24)
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

    //avg engagement per post for each day and hour
    for (const day in Object.keys(dayOfWeekCounts)) {
        const dayData = dayOfWeekCounts[Number(day)];
        dayData.engagement =
            dayData.count > 0 ? dayData.engagement / dayData.count : 0;
    }

    for (const hourCount in hourCounts) {
        hourCounts[Number(hourCount)].engagement =
            hourCounts[Number(hourCount)].count > 0
                ? hourCounts[Number(hourCount)].engagement /
                  hourCounts[Number(hourCount)].count
                : 0;
    }

    // best day and hour
    const bestDay = Object.entries(dayOfWeekCounts).sort(
        (a, b) => b[1].engagement - a[1].engagement,
    )[0];

    const bestHour = hourCounts
        .map((data, hour) => ({ hour, ...data }))
        .sort((a, b) => b.engagement - a.engagement)[0];

    return {
        byDay: dayOfWeekCounts,
        byHour: hourCounts,
        bestDay: {
            day: getDayName(Number(bestDay[0])),
            engagement: bestDay[1].engagement,
        },
        bestHour: {
            hour: bestHour.hour,
            engagement: bestHour.engagement,
        },
    };

    function getDayName(day: number): string {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return days[day];
    }
};
