// src/services/hotel.service.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class HotelService {
  async createHotel(data: any) {
    return await prisma.hotel.create({ data });
  }

  async getHotels(filter: any = {}) {
    return await prisma.hotel.findMany({
      where: filter,
    });
  }

  async getHotelById(id: string) {
    return await prisma.hotel.findUnique({ where: { id } });
  }

  async updateHotel(id: string, data: any) {
    return await prisma.hotel.update({ where: { id }, data });
  }

  async deleteHotel(id: string) {
    return await prisma.hotel.delete({ where: { id } });
  }

  async searchHotels(query: any) {
    const { checkin, checkout, guests, rooms } = query;

    return await prisma.hotel.findMany({
      where: {
        enabled: true,
        // Add more filters if needed (e.g., date availability)
      },
      include: {
        rooms: true,
      },
    });
  }
}
