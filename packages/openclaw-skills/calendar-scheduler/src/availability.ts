import type { AvailabilitySlot } from "@realestate/shared";
import type { BusySlot } from "./google-calendar";
import type { CalendarConfig } from "./index";

export class AvailabilityEngine {
  private config: CalendarConfig;

  constructor(config: CalendarConfig) {
    this.config = config;
  }

  calculateSlots(
    date: string,
    durationMinutes: number,
    busySlots: BusySlot[]
  ): AvailabilitySlot[] {
    const dayOfWeek = new Date(date).getDay();
    if (!this.config.workingDays.includes(dayOfWeek)) {
      return [];
    }

    const dayStart = new Date(`${date}T${this.config.workingHours.start}:00`);
    const dayEnd = new Date(`${date}T${this.config.workingHours.end}:00`);
    const slotDuration = durationMinutes * 60 * 1000;
    const bufferMs = this.config.bufferMinutes * 60 * 1000;

    const busy = busySlots
      .map((s) => ({
        start: new Date(s.start).getTime(),
        end: new Date(s.end).getTime(),
      }))
      .sort((a, b) => a.start - b.start);

    const available: AvailabilitySlot[] = [];
    let cursor = dayStart.getTime();

    for (const slot of busy) {
      while (
        cursor + slotDuration <= slot.start &&
        cursor + slotDuration <= dayEnd.getTime()
      ) {
        available.push({
          start: new Date(cursor).toISOString(),
          end: new Date(cursor + slotDuration).toISOString(),
        });
        cursor += slotDuration + bufferMs;
      }
      cursor = Math.max(cursor, slot.end + bufferMs);
    }

    while (cursor + slotDuration <= dayEnd.getTime()) {
      available.push({
        start: new Date(cursor).toISOString(),
        end: new Date(cursor + slotDuration).toISOString(),
      });
      cursor += slotDuration + bufferMs;
    }

    return available;
  }
}
