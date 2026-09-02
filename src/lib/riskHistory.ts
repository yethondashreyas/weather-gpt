export interface RiskHistoryItem {
  date: string;
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  score: number;
}

export const DAILY_RISK_HISTORY: RiskHistoryItem[] = [
  { date: "08-04", level: "LOW", score: 15 },
  { date: "08-05", level: "LOW", score: 18 },
  { date: "08-06", level: "MODERATE", score: 32 },
  { date: "08-07", level: "MODERATE", score: 40 },
  { date: "08-08", level: "LOW", score: 20 },
  { date: "08-09", level: "LOW", score: 12 },
  { date: "08-10", level: "HIGH", score: 58 },
  { date: "08-11", level: "CRITICAL", score: 82 },
  { date: "08-12", level: "HIGH", score: 64 },
  { date: "08-13", level: "MODERATE", score: 45 },
  { date: "08-14", level: "LOW", score: 22 },
  { date: "08-15", level: "LOW", score: 14 },
  { date: "08-16", level: "MODERATE", score: 35 },
  { date: "08-17", level: "HIGH", score: 52 },
  { date: "08-18", level: "MODERATE", score: 42 },
  { date: "08-19", level: "LOW", score: 19 },
  { date: "08-20", level: "LOW", score: 10 },
  { date: "08-21", level: "LOW", score: 15 },
  { date: "08-22", level: "MODERATE", score: 38 },
  { date: "08-23", level: "HIGH", score: 60 },
  { date: "08-24", level: "CRITICAL", score: 88 },
  { date: "08-25", level: "CRITICAL", score: 79 },
  { date: "08-26", level: "HIGH", score: 55 },
  { date: "08-27", level: "MODERATE", score: 40 },
  { date: "08-28", level: "LOW", score: 25 },
  { date: "08-29", level: "LOW", score: 18 },
  { date: "08-30", level: "MODERATE", score: 30 },
  { date: "08-31", level: "MODERATE", score: 41 },
  { date: "09-01", level: "HIGH", score: 53 },
  { date: "09-02", level: "LOW", score: 20 },
];

export function getLevelFrequency() {
  const counts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
  DAILY_RISK_HISTORY.forEach((item) => {
    if (counts[item.level] !== undefined) {
      counts[item.level]++;
    }
  });
  return counts;
}
