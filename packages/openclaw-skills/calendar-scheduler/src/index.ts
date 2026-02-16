import type { AvailabilitySlot, BookingRequest } from "@realestate/shared";
import { GoogleCalendarClient } from "./google-calendar";
import { CalendlyClient } from "./calendly";
import { AvailabilityEngine } from "./availability";
import { GeoOptimizer } from "./geo-optimizer";
import { BookingOrchestrator } from "./booking-flow";

export interface CalendarConfig {
  googleCredentials?: {
    accessToken: string;
    refreshToken: string;
    calendarId: string;
  };
  calendlyApiKey?: string;
  timezone: string;
  workingHours: { start: string; end: string };
  workingDays: number[];
  bufferMinutes: number;
}

export class CalendarScheduler {
  private config: CalendarConfig;
  private google?: GoogleCalendarClient;
  private calendly?: CalendlyClient;
  private availability: AvailabilityEngine;
  private geoOptimizer: GeoOptimizer;
  private booking: BookingOrchestrator;

  constructor(config: CalendarConfig) {
    this.config = config;
    if (config.googleCredentials) {
      this.google = new GoogleCalendarClient(config.googleCredentials);
    }
    if (config.calendlyApiKey) {
      this.calendly = new CalendlyClient(config.calendlyApiKey);
    }
    this.availability = new AvailabilityEngine(config);
    this.geoOptimizer = new GeoOptimizer();
    this.booking = new BookingOrchestrator(this.google, this.calendly);
  }

  async getAvailableSlots(
    date: string,
    durationMinutes: number = 60
  ): Promise<AvailabilitySlot[]> {
    const busySlots = this.google ? await this.google.getBusySlots(date) : [];
    return this.availability.calculateSlots(date, durationMinutes, busySlots);
  }

  async bookAppointment(request: BookingRequest): Promise<{
    success: boolean;
    calendarEventId?: string;
    calendlyEventId?: string;
    error?: string;
  }> {
    return this.booking.book(request, this.config);
  }

  async cancelAppointment(calendarEventId: string): Promise<boolean> {
    if (this.google) {
      return this.google.deleteEvent(calendarEventId);
    }
    return false;
  }

  async optimizeShowingRoute(
    appointments: { address: string; time: string }[]
  ): Promise<{ address: string; time: string; order: number }[]> {
    return this.geoOptimizer.optimizeRoute(appointments);
  }
}

export default CalendarScheduler;
