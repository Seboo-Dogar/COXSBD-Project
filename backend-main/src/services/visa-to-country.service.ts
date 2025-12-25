import { PrismaClient, VisaToCountry } from "@prisma/client";
const prisma = new PrismaClient();

export class VisaToCountryService {
  /**
   * Creates a new visa to country in the database.
   */
  async createVisaToCountry(data: Omit<VisaToCountry, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.visaToCountry.create({
      data,
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Retrieves all visa to countries, with optional filtering and pagination.
   */
  async getVisaToCountries(filter: any = {}, skip = 0, take = 10) {
    const [visaToCountries, total] = await Promise.all([
      prisma.visaToCountry.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { visaBookings: true },
          },
        },
      }),
      prisma.visaToCountry.count({ where: filter }),
    ]);

    return {
      visaToCountries,
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
   * Retrieves a single visa to country by its unique ID.
   */
  async getVisaToCountryById(id: string) {
    return await prisma.visaToCountry.findUnique({
      where: { id },
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Retrieves a single visa to country by its ISO code.
   */
  async getVisaToCountryByIso(iso: string) {
    return await prisma.visaToCountry.findUnique({
      where: { iso },
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Updates an existing visa to country.
   */
  async updateVisaToCountry(id: string, data: Partial<Omit<VisaToCountry, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.visaToCountry.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Deletes a visa to country.
   */
  async deleteVisaToCountry(id: string) {
    return await prisma.visaToCountry.delete({ where: { id } });
  }

  /**
   * Retrieves active visa to countries only, with optional pagination.
   */
  async getActiveVisaToCountries(skip = 0, take = 10) {
    const [visaToCountries, total] = await Promise.all([
      prisma.visaToCountry.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { visaBookings: true },
          },
        },
      }),
      prisma.visaToCountry.count({ where: { status: true } }),
    ]);

    return {
      visaToCountries,
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
   * Retrieves all visa to countries (no pagination, for dropdowns).
   */
  async getAllVisaToCountries() {
    return await prisma.visaToCountry.findMany({
      where: { status: true },
      orderBy: { country: 'asc' },
    });
  }
}

