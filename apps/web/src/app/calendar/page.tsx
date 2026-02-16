"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Clock, User, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const demoAppointments = [
  {
    id: "1",
    type: "SHOWING",
    leadName: "John Smith",
    leadEmail: "john@example.com",
    startTime: "2026-02-16T10:00:00Z",
    endTime: "2026-02-16T11:00:00Z",
    location: "123 Oak Avenue, Beverly Hills, CA",
    status: "CONFIRMED",
  },
  {
    id: "2",
    type: "SHOWING",
    leadName: "Sarah Johnson",
    leadEmail: "sarah@example.com",
    startTime: "2026-02-16T14:00:00Z",
    endTime: "2026-02-16T15:00:00Z",
    location: "456 Maple Drive, Santa Monica, CA",
    status: "PENDING",
  },
  {
    id: "3",
    type: "CONSULTATION",
    leadName: "Mike Chen",
    leadEmail: "mike@example.com",
    startTime: "2026-02-17T09:00:00Z",
    endTime: "2026-02-17T10:00:00Z",
    location: "Office - Virtual",
    status: "CONFIRMED",
  },
  {
    id: "4",
    type: "OPEN_HOUSE",
    leadName: "Open House",
    leadEmail: null,
    startTime: "2026-02-22T13:00:00Z",
    endTime: "2026-02-22T16:00:00Z",
    location: "789 Pine Street, Pasadena, CA",
    status: "CONFIRMED",
  },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

const typeLabels: Record<string, string> = {
  SHOWING: "Property Showing",
  CONSULTATION: "Consultation",
  OPEN_HOUSE: "Open House",
};

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">
              Manage showings, consultations, and open houses.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Sync Google Calendar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoAppointments.filter((a) => a.status !== "CANCELLED").length}
              </p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoAppointments.filter((a) => a.status === "PENDING").length}
              </p>
              <p className="text-xs text-muted-foreground">Pending Confirmation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoAppointments.filter((a) => a.type === "SHOWING").length}
              </p>
              <p className="text-xs text-muted-foreground">Showings This Week</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {typeLabels[appt.type] || appt.type}
                      </span>
                      <Badge className={statusColors[appt.status]}>
                        {appt.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(appt.startTime)} -{" "}
                        {new Date(appt.endTime).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {appt.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {appt.leadName}
                        {appt.leadEmail && (
                          <span className="text-xs">({appt.leadEmail})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appt.status === "PENDING" && (
                      <Button size="sm">Confirm</Button>
                    )}
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
