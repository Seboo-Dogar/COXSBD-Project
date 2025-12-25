import { PrismaClient, VisaBooking, VisaStatus } from "@prisma/client";
const prisma = new PrismaClient();

export class VisaBookingService {
  /**
   * Creates a new visa booking in the database.
   */
  async createVisaBooking(data: Omit<VisaBooking, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.visaBooking.create({
      data,
      include: {
        fromCountry: true,
        toCountry: true,
      },
    });
  }

  /**
   * Retrieves all visa bookings, with optional filtering and pagination.
   */
  async getVisaBookings(filter: any = {}, skip = 0, take = 10) {
    const [visaBookings, total] = await Promise.all([
      prisma.visaBooking.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          fromCountry: true,
          toCountry: true,
        },
      }),
      prisma.visaBooking.count({ where: filter }),
    ]);

    return {
      visaBookings,
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
   * Retrieves a single visa booking by its unique ID.
   */
  async getVisaBookingById(id: string) {
    return await prisma.visaBooking.findUnique({
      where: { id },
      include: {
        fromCountry: true,
        toCountry: true,
      },
    });
  }

  /**
   * Updates an existing visa booking.
   */
  async updateVisaBooking(id: string, data: Partial<Omit<VisaBooking, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.visaBooking.update({
      where: { id },
      data,
      include: {
        fromCountry: true,
        toCountry: true,
      },
    });
  }

  /**
   * Deletes a visa booking.
   */
  async deleteVisaBooking(id: string) {
    return await prisma.visaBooking.delete({ where: { id } });
  }

  /**
   * Retrieves visa bookings by status, with optional pagination.
   */
  async getVisaBookingsByStatus(status: VisaStatus, skip = 0, take = 10) {
    const [visaBookings, total] = await Promise.all([
      prisma.visaBooking.findMany({
        where: { status },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          fromCountry: true,
          toCountry: true,
        },
      }),
      prisma.visaBooking.count({ where: { status } }),
    ]);

    return {
      visaBookings,
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
   * Retrieves visa bookings by email, with optional pagination.
   */
  async getVisaBookingsByEmail(email: string, skip = 0, take = 10) {
    const [visaBookings, total] = await Promise.all([
      prisma.visaBooking.findMany({
        where: { email },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          fromCountry: true,
          toCountry: true,
        },
      }),
      prisma.visaBooking.count({ where: { email } }),
    ]);

    return {
      visaBookings,
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

