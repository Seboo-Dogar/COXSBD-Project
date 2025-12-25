export type FlightType = "ECONOMY" | "ECONOMY_PREMIUM" | "BUSINESS" | "FIRST";

export interface Flight {
  id: string;
  userId: string;
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  adultSeatPrice: number;
  childPrice: number;
  infantPrice: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  baggage: string;
  cabinBaggage: string;
  type?: FlightType;
  status?: boolean;
  refundable?: boolean;
  offer?: boolean;
  user?: {
    id: string;
    email: string;
  } | null;
  airline?: any;
  fromAirport?: any;
  toAirport?: any;
  [key: string]: any;
}

export interface FlightsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface FlightsResult {
  flights: Flight[];
  meta: FlightsMeta;
}

export interface FlightPayload {
  userId: string;
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  adultSeatPrice: number;
  childPrice: number;
  infantPrice: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  baggage: string;
  cabinBaggage: string;
  type?: FlightType;
  status?: boolean;
  refundable?: boolean;
  offer?: boolean;
  [key: string]: any;
}

export interface FlightFilters {
  status?: boolean;
  userId?: string;
  airlineId?: string;
  fromAirportId?: string;
  toAirportId?: string;
  type?: string;
  offer?: boolean;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
