import { PrismaClient, TourExclusion } from "@prisma/client";
const prisma = new PrismaClient();

export class TourExclusionService {
  /**
   * Creates a new tour exclusion in the database.
   */
  async createTourExclusion(data: Omit<TourExclusion, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.tourExclusion.create({ data });
  }

  /**
   * Retrieves all tour exclusions, with optional filtering and pagination.
   */
  async getTourExclusions(filter: any = {}, skip = 0, take = 10) {
    const [tourExclusions, total] = await Promise.all([
      prisma.tourExclusion.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tours: true },
          },
        },
      }),
      prisma.tourExclusion.count({ where: filter }),
    ]);

    return {
      tourExclusions,
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
   * Retrieves a single tour exclusion by its unique ID.
   */
  async getTourExclusionById(id: string) {
    return await prisma.tourExclusion.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Retrieves a single tour exclusion by its name.
   */
  async getTourExclusionByName(name: string) {
    return await prisma.tourExclusion.findUnique({
      where: { name },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Updates an existing tour exclusion.
   */
  async updateTourExclusion(id: string, data: Partial<Omit<TourExclusion, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.tourExclusion.update({ where: { id }, data });
  }

  /**
   * Deletes a tour exclusion.
   */
  async deleteTourExclusion(id: string) {
    return await prisma.tourExclusion.delete({ where: { id } });
  }

  /**
   * Retrieves all tour exclusions (no pagination, for dropdowns).
   */
  async getAllTourExclusions() {
    return await prisma.tourExclusion.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

