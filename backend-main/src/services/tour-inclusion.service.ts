import { PrismaClient, TourInclusion } from "@prisma/client";
const prisma = new PrismaClient();

export class TourInclusionService {
  /**
   * Creates a new tour inclusion in the database.
   */
  async createTourInclusion(data: Omit<TourInclusion, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.tourInclusion.create({ data });
  }

  /**
   * Retrieves all tour inclusions, with optional filtering and pagination.
   */
  async getTourInclusions(filter: any = {}, skip = 0, take = 10) {
    const [tourInclusions, total] = await Promise.all([
      prisma.tourInclusion.findMany({
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
      prisma.tourInclusion.count({ where: filter }),
    ]);

    return {
      tourInclusions,
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
   * Retrieves a single tour inclusion by its unique ID.
   */
  async getTourInclusionById(id: string) {
    return await prisma.tourInclusion.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Retrieves a single tour inclusion by its name.
   */
  async getTourInclusionByName(name: string) {
    return await prisma.tourInclusion.findUnique({
      where: { name },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Updates an existing tour inclusion.
   */
  async updateTourInclusion(id: string, data: Partial<Omit<TourInclusion, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.tourInclusion.update({ where: { id }, data });
  }

  /**
   * Deletes a tour inclusion.
   */
  async deleteTourInclusion(id: string) {
    return await prisma.tourInclusion.delete({ where: { id } });
  }

  /**
   * Retrieves all tour inclusions (no pagination, for dropdowns).
   */
  async getAllTourInclusions() {
    return await prisma.tourInclusion.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

