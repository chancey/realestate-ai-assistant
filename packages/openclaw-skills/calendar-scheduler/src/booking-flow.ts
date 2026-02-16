import type { BookingRequest } from "@realestate/shared";
import type { GoogleCalendarClient } from "./google-calendar";
import type { CalendlyClient } from "./calendly";
import type { CalendarConfig } from "./index";

export class BookingOrchestrator {
  private google?: GoogleCalendarClient;
  private calendly?: CalendlyClient;

  constructor(google?: GoogleCalendarClient, calendly?: CalendlyClient) {
    this.google = google;
    this.calendly = calendly;
  }

  async book(
    request: BookingRequest,
    config: CalendarConfig
  ): Promise<{
    success: boolean;
    calendarEventId?: string;
    calendlyEventId?: string;
    error?: string;
  }> {
    try {
      let calendarEventId: string | undefined;
      const calendlyEventId: string | undefined = undefined;
      void this.calendly;

      if (
        this.google &&
        request.preferredTimes &&
        request.preferredTimes.length > 0
      ) {
        const startTime = request.preferredTimes[0];
        const endTime = new Date(
          new Date(startTime).getTime() + 60 * 60 * 1000
        ).toISOString();

        calendarEventId = await this.google.createEvent({
          summary: `Showing: ${request.listingId || "Property"} with ${request.leadName}`,
          description: [
            `Property showing with ${request.leadName}.`,
            request.leadEmail ? `Email: ${request.leadEmail}` : "",
            request.leadPhone ? `Phone: ${request.leadPhone}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          start: { dateTime: startTime, timeZone: config.timezone },
          end: { dateTime: endTime, timeZone: config.timezone },
          attendees: request.leadEmail
            ? [{ email: request.leadEmail, displayName: request.leadName }]
            : undefined,
        });
      }

      return { success: true, calendarEventId, calendlyEventId };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}
