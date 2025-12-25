export interface Airport {
  id: string;
  code: string;
  airport: string;
  city: string;
  country: string;
  status?: boolean;
  [key: string]: any;
}

export interface AirportsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface AirportsResult {
  airports: Airport[];
  meta: AirportsMeta;
}

export interface AirportPayload {
  code: string;
  airport: string;
  city: string;
  country: string;
  status?: boolean;
  [key: string]: any;
}

export interface AirportFilters {
  status?: boolean;
  country?: string;
  city?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
