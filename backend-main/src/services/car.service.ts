// src/services/car.service.ts

import { PrismaClient, Car } from "@prisma/client";
const prisma = new PrismaClient();

// Define the interface for complex search criteria
interface SearchCriteria {
  pickup?: string;
  dropoff?: string;
  pickupDate?: string;
  passengers?: number | string;
  category?: string;
  transmission?: string;
}

// Define the interface for basic filtering (used by getCars)
interface CarFilter {
  category?: string;
  name?: { contains: string; mode: "insensitive" };
  // Allows any additional properties for dynamic Prisma filtering
  [key: string]: any; 
}

export class CarService {
  /**
   * Creates a new car listing in the database.
   */
  async createCar(data: Omit<Car, 'id'>) {
    // NOTE: `data` must match the schema (e.g., features must be a JSON object/string)
    return await prisma.car.create({ data });
  }

  /**
   * Retrieves all car listings, with optional filtering.
   * This is typically used by the Admin panel or a generalized catalog view.
   */
  async getCars(filter: CarFilter = {}) {
    return await prisma.car.findMany({
      where: filter,
    });
  }

  /**
   * Retrieves a single car listing by its unique ID.
   */
  async getCarById(id: string) {
    return await prisma.car.findUnique({ where: { id } });
  }

  /**
   * Updates an existing car listing.
   */
  async updateCar(id: string, data: Partial<Omit<Car, 'id'>>) {
    return await prisma.car.update({ where: { id }, data });
  }

  /**
   * Deletes a car listing.
   */
  async deleteCar(id: string) {
    return await prisma.car.delete({ where: { id } });
  }

  /**
   * Implements complex search/filtering based on user criteria.
   * This logic handles the main search form from the frontend.
   */
  async searchCars(query: SearchCriteria) {
    const { passengers, category, transmission } = query;

    // 1. Construct a dynamic search query for Prisma
    const whereClause: any = {
      available: true, // Only show cars marked available
    };

    if (passengers) {
      // Convert to integer and filter for enough seats
      const seatsRequired = parseInt(passengers as string);
      if (!isNaN(seatsRequired)) {
        whereClause.seats = { gte: seatsRequired };
      }
    }

    if (category) {
      whereClause.category = category;
    }

    if (transmission) {
      whereClause.transmission = transmission;
    }

    // NOTE: Real-world availability checks (checking booking table for date conflicts)
    // would be added here using a complex `NOT IN` or subquery logic.

    return await prisma.car.findMany({
      where: whereClause,
      // Default ordering by rating for better user experience
      orderBy: { rating: 'desc' }
    });
  }
}