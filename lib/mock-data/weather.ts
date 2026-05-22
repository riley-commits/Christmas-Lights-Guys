import type { WeatherDay } from "@/lib/types";

// 14-day Winnipeg-ish forecast starting 2026-05-22 (today)
export const weather: WeatherDay[] = [
  { date: "2026-05-22", condition: "clear", highC: 19, lowC: 7, precipChance: 5, windKph: 14 },
  { date: "2026-05-23", condition: "cloudy", highC: 16, lowC: 6, precipChance: 30, windKph: 22 },
  { date: "2026-05-24", condition: "rain", highC: 12, lowC: 4, precipChance: 80, windKph: 28, warning: "Heavy rain — postpone installs" },
  { date: "2026-05-25", condition: "clear", highC: 17, lowC: 5, precipChance: 10, windKph: 12 },
  { date: "2026-05-26", condition: "clear", highC: 21, lowC: 9, precipChance: 5, windKph: 8 },
  { date: "2026-05-27", condition: "wind", highC: 18, lowC: 8, precipChance: 15, windKph: 45, warning: "High winds — ladder risk" },
  { date: "2026-05-28", condition: "cloudy", highC: 15, lowC: 6, precipChance: 25, windKph: 18 },
  { date: "2026-05-29", condition: "clear", highC: 20, lowC: 8, precipChance: 5, windKph: 10 },
  { date: "2026-05-30", condition: "clear", highC: 22, lowC: 10, precipChance: 5, windKph: 12 },
  { date: "2026-05-31", condition: "cloudy", highC: 19, lowC: 9, precipChance: 20, windKph: 16 },
  { date: "2026-06-01", condition: "clear", highC: 21, lowC: 9, precipChance: 10, windKph: 14 },
  { date: "2026-06-02", condition: "cloudy", highC: 18, lowC: 8, precipChance: 30, windKph: 20 },
  { date: "2026-06-03", condition: "clear", highC: 20, lowC: 9, precipChance: 10, windKph: 12 },
  { date: "2026-06-04", condition: "clear", highC: 23, lowC: 11, precipChance: 5, windKph: 8 },
  { date: "2026-06-05", condition: "clear", highC: 24, lowC: 12, precipChance: 5, windKph: 10 },
  { date: "2026-06-06", condition: "cloudy", highC: 21, lowC: 10, precipChance: 25, windKph: 18 },
  { date: "2026-06-07", condition: "clear", highC: 22, lowC: 11, precipChance: 10, windKph: 12 },
  { date: "2026-06-08", condition: "rain", highC: 16, lowC: 8, precipChance: 70, windKph: 32, warning: "Wet conditions — check ladders" },
  { date: "2026-06-09", condition: "cloudy", highC: 18, lowC: 8, precipChance: 30, windKph: 18 },
  { date: "2026-06-10", condition: "clear", highC: 21, lowC: 10, precipChance: 10, windKph: 14 },
];

export function getWeather(date: string): WeatherDay | undefined {
  return weather.find((w) => w.date === date);
}
