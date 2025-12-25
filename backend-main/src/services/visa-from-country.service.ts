import { PrismaClient, VisaFromCountry } from "@prisma/client";
const prisma = new PrismaClient();

export class VisaFromCountryService {
  /**
   * Creates a new visa from country in the database.
   */
  async createVisaFromCountry(data: Omit<VisaFromCountry, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.visaFromCountry.create({
      data,
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Retrieves all visa from countries, with optional filtering and pagination.
   */
  async getVisaFromCountries(filter: any = {}, skip = 0, take = 10) {
    const [visaFromCountries, total] = await Promise.all([
      prisma.visaFromCountry.findMany({
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
      prisma.visaFromCountry.count({ where: filter }),
    ]);

    return {
      visaFromCountries,
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
   * Retrieves a single visa from country by its unique ID.
   */
  async getVisaFromCountryById(id: string) {
    return await prisma.visaFromCountry.findUnique({
      where: { id },
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Retrieves a single visa from country by its ISO code.
   */
  async getVisaFromCountryByIso(iso: string) {
    return await prisma.visaFromCountry.findUnique({
      where: { iso },
      include: {
        _count: {
          select: { visaBookings: true },
        },
      },
    });
  }

  /**
   * Updates an existing visa from country.
   */
  async updateVisaFromCountry(id: string, data: Partial<Omit<VisaFromCountry, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.visaFromCountry.update({
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
   * Deletes a visa from country.
   */
  async deleteVisaFromCountry(id: string) {
    return await prisma.visaFromCountry.delete({ where: { id } });
  }

  /**
   * Retrieves active visa from countries only, with optional pagination.
   */
  async getActiveVisaFromCountries(skip = 0, take = 10) {
    const [visaFromCountries, total] = await Promise.all([
      prisma.visaFromCountry.findMany({
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
      prisma.visaFromCountry.count({ where: { status: true } }),
    ]);

    return {
      visaFromCountries,
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
   * Retrieves all visa from countries (no pagination, for dropdowns).
   */
  async getAllVisaFromCountries() {
    return await prisma.visaFromCountry.findMany({
      where: { status: true },
      orderBy: { country: 'asc' },
    });
  }
}

