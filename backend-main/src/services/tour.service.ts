import { PrismaClient, Tour } from "@prisma/client";
const prisma = new PrismaClient();

export class TourService {
  /**
   * Creates a new tour in the database.
   */
  async createTour(data: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'> & {
    inclusions?: string[];
    exclusions?: string[];
  }) {
    const { inclusions, exclusions, ...tourData } = data;
    
    const createData: any = { ...tourData };
    
    if (inclusions && inclusions.length > 0) {
      createData.inclusions = {
        connect: inclusions.map(id => ({ id })),
      };
    }
    
    if (exclusions && exclusions.length > 0) {
      createData.exclusions = {
        connect: exclusions.map(id => ({ id })),
      };
    }
    
    return await prisma.tour.create({
      data: createData,
      include: {
        tourType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        inclusions: true,
        exclusions: true,
      },
    });
  }

  /**
   * Retrieves all tours, with optional filtering and pagination.
   */
  async getTours(filter: any = {}, skip = 0, take = 10) {
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where: filter,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tourType: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          inclusions: true,
          exclusions: true,
        },
      }),
      prisma.tour.count({ where: filter }),
    ]);

    return {
      tours,
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
   * Retrieves a single tour by its unique ID.
   */
  async getTourById(id: string) {
    return await prisma.tour.findUnique({
      where: { id },
      include: {
        tourType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        inclusions: true,
        exclusions: true,
      },
    });
  }

  /**
   * Updates an existing tour.
   */
  async updateTour(id: string, data: Partial<Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>> & {
    inclusions?: string[];
    exclusions?: string[];
  }) {
    const { inclusions, exclusions, ...tourData } = data;
    
    const updateData: any = { ...tourData };
    
    if (inclusions !== undefined) {
      updateData.inclusions = {
        set: inclusions.map(id => ({ id })),
      };
    }
    
    if (exclusions !== undefined) {
      updateData.exclusions = {
        set: exclusions.map(id => ({ id })),
      };
    }
    
    return await prisma.tour.update({
      where: { id },
      data: updateData,
      include: {
        tourType: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        inclusions: true,
        exclusions: true,
      },
    });
  }

  /**
   * Deletes a tour.
   */
  async deleteTour(id: string) {
    return await prisma.tour.delete({ where: { id } });
  }

  /**
   * Retrieves active tours only, with optional pagination.
   */
  async getActiveTours(skip = 0, take = 10) {
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tourType: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          inclusions: true,
          exclusions: true,
        },
      }),
      prisma.tour.count({ where: { status: true } }),
    ]);

    return {
      tours,
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
   * Retrieves featured tours only, with optional pagination.
   */
  async getFeaturedTours(skip = 0, take = 10) {
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where: { featured: true, status: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tourType: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          inclusions: true,
          exclusions: true,
        },
      }),
      prisma.tour.count({ where: { featured: true, status: true } }),
    ]);

    return {
      tours,
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
   * Retrieves tours with offers (offer = true), with optional pagination.
   */
  async getToursWithOffers(skip = 0, take = 10) {
    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where: { 
          offer: true,
          status: true, // Only active tours with offers
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tourType: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          inclusions: true,
          exclusions: true,
        },
      }),
      prisma.tour.count({ 
        where: { 
          offer: true,
          status: true,
        },
      }),
    ]);

    return {
      tours,
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

