import { PrismaClient, BusTrip } from "@prisma/client";

const prisma = new PrismaClient();

export class BusService {
  // Fetch trips for users (available only) or admins (all)
  static async getAllTrips(adminView: boolean = false): Promise<BusTrip[]> {
    return await prisma.busTrip.findMany({
      where: adminView ? {} : { available: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTripById(id: string): Promise<BusTrip | null> {
    return await prisma.busTrip.findUnique({ where: { id } });
  }

  // LOGIC: Calculate which specific seats are free
  static async getAvailableSeatList(tripId: string): Promise<string[]> {
    const trip = await prisma.busTrip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error("Trip not found");

    // Generate Full Map (A1, A2, B1, B2...)
    const fullSeatMap: string[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    let count = 0;
    for (const row of rows) {
      for (let num = 1; num <= 4; num++) {
        if (count < trip.totalSeats) {
          fullSeatMap.push(`${row}${num}`);
          count++;
        }
      }
    }

    const data = (trip.busData as any) || {};
    const booked = data.bookedSeats || [];
    
    // Return seats that are NOT in the bookedSeats array
    return fullSeatMap.filter(seat => !booked.includes(seat));
  }

  // TRANSACTION: Ensures seat selection is safe from double-booking
  static async reserveSeats(tripId: string, seatNumbers: string[]): Promise<BusTrip> {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.busTrip.findUnique({ where: { id: tripId } });
      if (!trip) throw new Error("Trip not found");

      const data = (trip.busData as any) || {};
      const alreadyBooked = data.bookedSeats || [];

      // Check if any requested seats are already taken
      const conflicts = seatNumbers.filter(s => alreadyBooked.includes(s));
      if (conflicts.length > 0) throw new Error(`Seats already taken: ${conflicts.join(", ")}`);

      return await tx.busTrip.update({
        where: { id: tripId },
        data: {
          availableSeats: { decrement: seatNumbers.length },
          busData: {
            ...data,
            bookedSeats: [...alreadyBooked, ...seatNumbers]
          }
        }
      });
    });
  }

  // ADMIN ACTIONS
  static async createTrip(payload: any): Promise<BusTrip> {
    const total = parseInt(payload.totalSeats) || 40;
    return await prisma.busTrip.create({
      data: {
        operator: payload.operator,
        busType: payload.busType,
        departureTime: payload.departureTime,
        arrivalTime: payload.arrivalTime,
        duration: payload.duration,
        pricePerSeat: parseFloat(payload.pricePerSeat),
        totalSeats: total,
        availableSeats: total,
        rating: payload.rating ? parseFloat(payload.rating) : 0.0,
        available: payload.available ?? true,
        busData: { 
          bookedSeats: [], 
          amenities: payload.amenities || [] 
        }
      }
    });
  }

  static async updateTrip(id: string, payload: any): Promise<BusTrip> {
    const updateData = { ...payload };
    if (payload.pricePerSeat) updateData.pricePerSeat = parseFloat(payload.pricePerSeat);
    if (payload.totalSeats) updateData.totalSeats = parseInt(payload.totalSeats);

    return await prisma.busTrip.update({ where: { id }, data: updateData });
  }

  static async deleteTrip(id: string): Promise<BusTrip> {
    return await prisma.busTrip.delete({ where: { id } });
  }
}