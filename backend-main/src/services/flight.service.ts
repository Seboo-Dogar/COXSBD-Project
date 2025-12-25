import { PrismaClient, Flight } from "@prisma/client";
const prisma = new PrismaClient();

export class FlightService {
  /**
   * Creates a new flight in the database.
   */
  async createFlight(data: Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.flight.create({ data });
  }

  /**
   * Retrieves all flights, with optional filtering and pagination.
   */
  async getFlights(filter: any = {}, skip = 0, take = 10) {
    const [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          airline: true,
          fromAirport: true,
          toAirport: true,
        },
      }),
      prisma.flight.count({ where: filter }),
    ]);

    return {
      flights,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
        limit: take,
        skip,
      },
    };
  }

  /**
   * Retrieves a single flight by its unique ID.
   */
  async getFlightById(id: string) {
    return await prisma.flight.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        airline: true,
        fromAirport: true,
        toAirport: true,
      },
    });
  }

  /**
   * Updates an existing flight.
   */
  async updateFlight(id: string, data: Partial<Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.flight.update({ where: { id }, data });
  }

  /**
   * Deletes a flight.
   */
  async deleteFlight(id: string) {
    return await prisma.flight.delete({ where: { id } });
  }

  /**
   * Retrieves active flights only, with optional pagination.
   */
  async getActiveFlights(skip = 0, take = 10) {
    const [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { departureTime: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          airline: true,
          fromAirport: true,
          toAirport: true,
        },
      }),
      prisma.flight.count({ where: { status: true } }),
    ]);

    return {
      flights,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
        limit: take,
        skip,
      },
    };
  }

  /**
   * Retrieves flights with offers (offer = true), with optional pagination.
   */
  async getFlightsWithOffers(skip = 0, take = 10) {
    const [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where: { 
          offer: true,
          status: true, // Only active flights with offers
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          airline: true,
          fromAirport: true,
          toAirport: true,
        },
      }),
      prisma.flight.count({ 
        where: { 
          offer: true,
          status: true,
        },
      }),
    ]);

    return {
      flights,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
        limit: take,
        skip,
      },
    };
  }
}

