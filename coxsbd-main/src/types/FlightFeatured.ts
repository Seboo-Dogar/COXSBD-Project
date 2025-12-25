export interface FlightFeatured {
  id: string;
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  price: number;
  status?: boolean;
  airline?: any;
  fromAirport?: any;
  toAirport?: any;
  [key: string]: any;
}

export interface FlightFeaturedsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface FlightFeaturedsResult {
  flightFeatureds: FlightFeatured[];
  meta: FlightFeaturedsMeta;
}

export interface FlightFeaturedPayload {
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  price: number;
  status?: boolean;
  [key: string]: any;
}

export interface FlightFeaturedFilters {
  status?: boolean;
  airlineId?: string;
  fromAirportId?: string;
  toAirportId?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
