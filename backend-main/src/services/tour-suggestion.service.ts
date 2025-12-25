import { PrismaClient, TourSuggestion } from "@prisma/client";
const prisma = new PrismaClient();

export class TourSuggestionService {
  /**
   * Creates a new tour suggestion in the database.
   */
  async createTourSuggestion(data: Omit<TourSuggestion, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.tourSuggestion.create({ data });
  }

  /**
   * Retrieves all tour suggestions, with optional filtering and pagination.
   */
  async getTourSuggestions(filter: any = {}, skip = 0, take = 10) {
    const [tourSuggestions, total] = await Promise.all([
      prisma.tourSuggestion.findMany({
        where: filter,
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      prisma.tourSuggestion.count({ where: filter }),
    ]);

    return {
      tourSuggestions,
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
   * Retrieves a single tour suggestion by its unique ID.
   */
  async getTourSuggestionById(id: string) {
    return await prisma.tourSuggestion.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing tour suggestion.
   */
  async updateTourSuggestion(id: string, data: Partial<Omit<TourSuggestion, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.tourSuggestion.update({ where: { id }, data });
  }

  /**
   * Deletes a tour suggestion.
   */
  async deleteTourSuggestion(id: string) {
    return await prisma.tourSuggestion.delete({ where: { id } });
  }

  /**
   * Retrieves active tour suggestions only, with optional pagination.
   */
  async getActiveTourSuggestions(skip = 0, take = 10) {
    const [tourSuggestions, total] = await Promise.all([
      prisma.tourSuggestion.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      prisma.tourSuggestion.count({ where: { status: true } }),
    ]);

    return {
      tourSuggestions,
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

