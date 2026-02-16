export class GeoOptimizer {
  async optimizeRoute(
    appointments: { address: string; time: string }[]
  ): Promise<{ address: string; time: string; order: number }[]> {
    // In production, use Google Maps Distance Matrix API
    // to calculate optimal route between showings
    return appointments
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .map((appt, index) => ({ ...appt, order: index + 1 }));
  }

  async estimateDriveTime(_from: string, _to: string): Promise<number> {
    // In production, call Google Maps Directions API
    return 30; // Default 30 minutes
  }
}
