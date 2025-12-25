import { PrismaClient, FlightFeatured } from "@prisma/client";
const prisma = new PrismaClient();

export class FlightFeaturedService {
  /**
   * Creates a new featured flight in the database.
   */
  async createFlightFeatured(data: Omit<FlightFeatured, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.flightFeatured.create({ data });
  }

  /**
   * Retrieves all featured flights, with optional filtering and pagination.
   */
  async getFlightFeatureds(filter: any = {}, skip = 0, take = 10) {
    const [flightFeatureds, total] = await Promise.all([
      prisma.flightFeatured.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          airline: true,
          fromAirport: true,
          toAirport: true,
        },
      }),
      prisma.flightFeatured.count({ where: filter }),
    ]);

    return {
      flightFeatureds,
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
   * Retrieves a single featured flight by its unique ID.
   */
  async getFlightFeaturedById(id: string) {
    return await prisma.flightFeatured.findUnique({
      where: { id },
      include: {
        airline: true,
        fromAirport: true,
        toAirport: true,
      },
    });
  }

  /**
   * Updates an existing featured flight.
   */
  async updateFlightFeatured(id: string, data: Partial<Omit<FlightFeatured, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.flightFeatured.update({ where: { id }, data });
  }

  /**
   * Deletes a featured flight.
   */
  async deleteFlightFeatured(id: string) {
    return await prisma.flightFeatured.delete({ where: { id } });
  }

  /**
   * Retrieves active featured flights only, with optional pagination.
   */
  async getActiveFlightFeatureds(skip = 0, take = 10) {
    const [flightFeatureds, total] = await Promise.all([
      prisma.flightFeatured.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          airline: true,
          fromAirport: true,
          toAirport: true,
        },
      }),
      prisma.flightFeatured.count({ where: { status: true } }),
    ]);

    return {
      flightFeatureds,
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

