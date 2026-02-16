import type { Platform } from "@realestate/shared";

// Optimal posting times based on platform analytics research
const OPTIMAL_TIMES: Record<Platform, { hour: number; days: number[] }[]> = {
  FACEBOOK: [
    { hour: 9, days: [1, 2, 3, 4, 5] },
    { hour: 13, days: [1, 2, 3, 4, 5] },
    { hour: 11, days: [0, 6] },
  ],
  INSTAGRAM: [
    { hour: 11, days: [1, 2, 3] },
    { hour: 14, days: [4, 5] },
    { hour: 10, days: [0, 6] },
  ],
  TIKTOK: [
    { hour: 19, days: [1, 2, 3, 4, 5] },
    { hour: 12, days: [0, 6] },
  ],
  LINKEDIN: [
    { hour: 8, days: [1, 2, 3, 4, 5] },
    { hour: 12, days: [2, 3] },
  ],
  X: [
    { hour: 8, days: [1, 2, 3, 4, 5] },
    { hour: 17, days: [1, 2, 3, 4, 5] },
  ],
  YOUTUBE: [
    { hour: 15, days: [4, 5] },
    { hour: 12, days: [0, 6] },
  ],
};

export function getOptimalPostTime(
  platform: Platform,
  _timezone: string,
  afterDate?: Date
): Date {
  const now = afterDate || new Date();
  const slots = OPTIMAL_TIMES[platform] || [{ hour: 10, days: [1, 2, 3, 4, 5] }];

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + dayOffset);

    for (const slot of slots) {
      if (slot.days.includes(candidate.getDay())) {
        candidate.setHours(slot.hour, 0, 0, 0);
        if (candidate > now) {
          return candidate;
        }
      }
    }
  }

  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 1);
  fallback.setHours(10, 0, 0, 0);
  return fallback;
}
