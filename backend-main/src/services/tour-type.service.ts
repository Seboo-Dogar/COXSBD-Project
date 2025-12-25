import { PrismaClient, TourType } from "@prisma/client";
const prisma = new PrismaClient();

export class TourTypeService {
  /**
   * Creates a new tour type in the database.
   */
  async createTourType(data: Omit<TourType, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.tourType.create({ data });
  }

  /**
   * Retrieves all tour types, with optional filtering and pagination.
   */
  async getTourTypes(filter: any = {}, skip = 0, take = 10) {
    const [tourTypes, total] = await Promise.all([
      prisma.tourType.findMany({
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
      prisma.tourType.count({ where: filter }),
    ]);

    return {
      tourTypes,
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
   * Retrieves a single tour type by its unique ID.
   */
  async getTourTypeById(id: string) {
    return await prisma.tourType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Retrieves a single tour type by its name.
   */
  async getTourTypeByName(name: string) {
    return await prisma.tourType.findUnique({
      where: { name },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
  }

  /**
   * Updates an existing tour type.
   */
  async updateTourType(id: string, data: Partial<Omit<TourType, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.tourType.update({ where: { id }, data });
  }

  /**
   * Deletes a tour type.
   */
  async deleteTourType(id: string) {
    return await prisma.tourType.delete({ where: { id } });
  }

  /**
   * Retrieves all tour types (no pagination, for dropdowns).
   */
  async getAllTourTypes() {
    return await prisma.tourType.findMany({
      orderBy: { name: 'asc' },
    });
  }
}

