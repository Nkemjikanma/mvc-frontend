import { analyseTimings } from "@/lib/analytics";
import type { Cast } from "@/lib/types";
import { motion } from "motion/react";

export function PostInsights({ casts }: { casts: Cast[] }) {
    const timingData = analyseTimings(casts);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: casts.length * 0.05 }}
            className="bg-white dark:bg-gray-950 rounded-lg border p-4 mb-6"
        >
            <h3 className="text-lg font-semibold mb-3">
                This weeks cast have done better on;
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400">
                        Best Day
                    </h4>
                    <p className="text-xl font-bold">
                        {timingData.bestDay.day}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Posts on this day get{" "}
                        {Math.round(timingData.bestDay.engagement)} avg.
                        engagement
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                    <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400">
                        Best Hour
                    </h4>
                    <p className="text-xl font-bold">
                        {formatHour(timingData.bestHour.hour)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Posts at this time get{" "}
                        {Math.round(timingData.bestHour.engagement)} avg.
                        engagement
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function formatHour(hour: number): string {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${ampm}`;
}
