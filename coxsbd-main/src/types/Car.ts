// src/types/Car.ts

export type Car = {
  id: string | number; // Prisma SQL ID is the primary identifier
  _id?: string;        // Optional, keep for compatibility if needed
  name: string;
  model: string;
  year: number;
  features: string[];
  price: string;
  numericPrice: number;
  originalPrice?: string;
  discount?: string;
  img: string; 
  rating: number;
  transmission: "Automatic" | "Manual";
  seats: number;
  fuelType: string;
  available: boolean;
  category: string;
  mileage: string;
  reviews: number;
};