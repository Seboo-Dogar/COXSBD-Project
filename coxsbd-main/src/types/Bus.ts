export interface BusTrip {
  id: string;
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  pricePerSeat: number;
  availableSeats: number;
  rating: number;
  available: boolean;
}

export type TimeSlot = "morning" | "afternoon" | "evening" | "night";
export type SortOption = 
  | "rating_high" 
  | "fare_low" 
  | "fare_high" 
  | "earliest_departure" 
  | "shortest_duration" 
  | "name_asc";