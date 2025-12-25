import { PrismaClient, Airline } from "@prisma/client";
const prisma = new PrismaClient();

export class AirlineService {
  /**
   * Creates a new airline in the database.
   */
  async createAirline(data: Omit<Airline, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.airline.create({ data });
  }

  /**
   * Retrieves all airlines, with optional filtering and pagination.
   */
  async getAirlines(filter: any = {}, skip = 0, take = 10) {
    const [airlines, total] = await Promise.all([
      prisma.airline.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.airline.count({ where: filter }),
    ]);

    return {
      airlines,
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
   * Retrieves a single airline by its unique ID.
   */
  async getAirlineById(id: string) {
    return await prisma.airline.findUnique({ where: { id } });
  }

  /**
   * Updates an existing airline.
   */
  async updateAirline(id: string, data: Partial<Omit<Airline, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.airline.update({ where: { id }, data });
  }

  /**
   * Deletes an airline.
   */
  async deleteAirline(id: string) {
    return await prisma.airline.delete({ where: { id } });
  }

  /**
   * Retrieves active airlines only, with optional pagination.
   */
  async getActiveAirlines(skip = 0, take = 10) {
    const [airlines, total] = await Promise.all([
      prisma.airline.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.airline.count({ where: { status: true } }),
    ]);

    return {
      airlines,
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

