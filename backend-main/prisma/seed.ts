import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.busTrip.deleteMany();

  console.log("Seeding categories...");
  const categories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Home & Furniture" },
    { name: "Beauty & Personal Care" },
    { name: "Sports & Outdoors" },
    { name: "Books & Stationery" },
    { name: "Toys & Games" },
    { name: "Groceries" },
    { name: "Automotive" },
    { name: "Pet Supplies" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Seeding bus trips...");

  const buses = [
    {
      operator: "Green Line Paribahan",
      busType: "Scania Multi-Axle (AC)",
      departureTime: "08:00 AM",
      arrivalTime: "04:00 PM",
      duration: "8h 00m",
      pricePerSeat: 1500,
      totalSeats: 40,
      availableSeats: 37,
      rating: 4.8,
      busData: {
        amenities: ["WiFi", "Water", "Blanket", "Charging Port"],
        bookedSeats: ["A1", "A2", "B1"] // Pre-booked for testing
      }
    },
    {
      operator: "Hanif Enterprise",
      busType: "Volvo Sleeper (AC)",
      departureTime: "10:30 PM",
      arrivalTime: "06:30 AM",
      duration: "8h 00m",
      pricePerSeat: 2200,
      totalSeats: 30,
      availableSeats: 28,
      rating: 4.5,
      busData: {
        amenities: ["Pillow", "Reading Light", "Water"],
        bookedSeats: ["L1", "L2"] // Sleeper seats use different labels
      }
    },
    {
      operator: "Ena Transport",
      busType: "Hyundai Universe (AC)",
      departureTime: "02:00 PM",
      arrivalTime: "10:00 PM",
      duration: "8h 00m",
      pricePerSeat: 1200,
      totalSeats: 40,
      availableSeats: 40,
      rating: 4.2,
      busData: {
        amenities: ["AC", "Water"],
        bookedSeats: [] // All available
      }
    }
  ];

  for (const bus of buses) {
    await prisma.busTrip.create({ data: bus });
  }

  console.log("Seed successful! Created 3 bus trips.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });