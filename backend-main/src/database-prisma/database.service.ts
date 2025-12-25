import { PrismaClient } from "@prisma/client";

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Expose Prisma client directly if needed
  get client() {
    return this.prisma;
  }

  // Add getters for your Prisma models to use like this.database.booking.findUnique(...)
  get user() {
    return this.prisma.user;
  }

  get hotel() {
    return this.prisma.hotel;
  }

  get busTrip() {
    return this.prisma.busTrip;
  }

  get room() {
    return this.prisma.room;
  }

  get booking() {
    return this.prisma.booking;
  }

  get payment() {
    return this.prisma.payment;
  }

  get hotelApiProvider() {
    return this.prisma.hotelApiProvider;
  }

  get airline() {
    return this.prisma.airline;
  }

  get airport() {
    return this.prisma.airport;
  }

  get flight() {
    return this.prisma.flight;
  }

  get flightFeatured() {
    return this.prisma.flightFeatured;
  }

  get flightSuggestion() {
    return this.prisma.flightSuggestion;
  }

  get tourType() {
    return this.prisma.tourType;
  }

  get tourInclusion() {
    return this.prisma.tourInclusion;
  }

  get tourExclusion() {
    return this.prisma.tourExclusion;
  }

  get tourSuggestion() {
    return this.prisma.tourSuggestion;
  }

  get tour() {
    return this.prisma.tour;
  }

  get visaFromCountry() {
    return this.prisma.visaFromCountry;
  }

  get visaToCountry() {
    return this.prisma.visaToCountry;
  }

  get visaBooking() {
    return this.prisma.visaBooking;
  }

  // Example custom helper methods:

  async findPaymentById(id: string) {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async createPayment(data: any) {
    return this.prisma.payment.create({ data });
  }

  // Add more helper methods as you need...

  // Disconnect Prisma client (e.g. on app shutdown)
  async disconnect() {
    await this.prisma.$disconnect();
  }
}
