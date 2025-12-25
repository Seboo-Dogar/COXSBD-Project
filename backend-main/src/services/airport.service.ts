import { PrismaClient, Airport } from "@prisma/client";
const prisma = new PrismaClient();

export class AirportService {
  /**
   * Creates a new airport in the database.
   */
  async createAirport(data: Omit<Airport, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.airport.create({ data });
  }

  /**
   * Retrieves all airports, with optional filtering and pagination.
   */
  async getAirports(filter: any = {}, skip = 0, take = 10) {
    const [airports, total] = await Promise.all([
      prisma.airport.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.airport.count({ where: filter }),
    ]);

    return {
      airports,
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
   * Retrieves a single airport by its unique ID.
   */
  async getAirportById(id: string) {
    return await prisma.airport.findUnique({ where: { id } });
  }

  /**
   * Retrieves a single airport by its code.
   */
  async getAirportByCode(code: string) {
    return await prisma.airport.findUnique({ where: { code } });
  }

  /**
   * Updates an existing airport.
   */
  async updateAirport(id: string, data: Partial<Omit<Airport, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.airport.update({ where: { id }, data });
  }

  /**
   * Deletes an airport.
   */
  async deleteAirport(id: string) {
    return await prisma.airport.delete({ where: { id } });
  }

  /**
   * Retrieves active airports only, with optional pagination.
   */
  async getActiveAirports(skip = 0, take = 10) {
    const [airports, total] = await Promise.all([
      prisma.airport.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { airport: 'asc' },
      }),
      prisma.airport.count({ where: { status: true } }),
    ]);

    return {
      airports,
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

