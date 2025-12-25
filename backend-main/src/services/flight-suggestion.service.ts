import { PrismaClient, FlightSuggestion } from "@prisma/client";
const prisma = new PrismaClient();

export class FlightSuggestionService {
  /**
   * Creates a new flight suggestion in the database.
   */
  async createFlightSuggestion(data: Omit<FlightSuggestion, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.flightSuggestion.create({ data });
  }

  /**
   * Retrieves all flight suggestions, with optional filtering and pagination.
   */
  async getFlightSuggestions(filter: any = {}, skip = 0, take = 10) {
    const [flightSuggestions, total] = await Promise.all([
      prisma.flightSuggestion.findMany({
        where: filter,
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      prisma.flightSuggestion.count({ where: filter }),
    ]);

    return {
      flightSuggestions,
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
   * Retrieves a single flight suggestion by its unique ID.
   */
  async getFlightSuggestionById(id: string) {
    return await prisma.flightSuggestion.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing flight suggestion.
   */
  async updateFlightSuggestion(id: string, data: Partial<Omit<FlightSuggestion, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.flightSuggestion.update({ where: { id }, data });
  }

  /**
   * Deletes a flight suggestion.
   */
  async deleteFlightSuggestion(id: string) {
    return await prisma.flightSuggestion.delete({ where: { id } });
  }

  /**
   * Retrieves active flight suggestions only, with optional pagination.
   */
  async getActiveFlightSuggestions(skip = 0, take = 10) {
    const [flightSuggestions, total] = await Promise.all([
      prisma.flightSuggestion.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      prisma.flightSuggestion.count({ where: { status: true } }),
    ]);

    return {
      flightSuggestions,
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

