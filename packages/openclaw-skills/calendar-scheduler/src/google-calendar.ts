export interface GoogleCalendarCredentials {
  accessToken: string;
  refreshToken: string;
  calendarId: string;
}

export interface BusySlot {
  start: string;
  end: string;
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
}

export class GoogleCalendarClient {
  private creds: GoogleCalendarCredentials;

  constructor(creds: GoogleCalendarCredentials) {
    this.creds = creds;
  }

  async getBusySlots(date: string): Promise<BusySlot[]> {
    // POST https://www.googleapis.com/calendar/v3/freeBusy
    // Body: { timeMin, timeMax, items: [{ id: calendarId }] }
    void date;
    return [];
  }

  async createEvent(event: CalendarEvent): Promise<string> {
    // POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
    void event;
    void this.creds;
    return `gcal_${Date.now()}`;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    // DELETE https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}
    void eventId;
    return true;
  }

  async listEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    // GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
    void startDate;
    void endDate;
    return [];
  }
}
