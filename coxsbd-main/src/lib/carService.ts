// services/carService.ts
import { CarType } from "@/types/Car";

export async function searchCars(query: Record<string, string>) {
  const qs = new URLSearchParams(query).toString(); // turns object → query string
  const res = await fetch(`/cars/search?${qs}`);
  if (!res.ok) throw new Error("Failed to search cars");
  return res.json() as Promise<CarType[]>;
}
