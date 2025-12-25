export interface Airline {
  id: string;
  iata: string;
  name: string;
  code: string;
  country: string;
  status?: boolean;
  [key: string]: any;
}

export interface AirlinesMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface AirlinesResult {
  airlines: Airline[];
  meta: AirlinesMeta;
}

export interface AirlinePayload {
  iata: string;
  name: string;
  code: string;
  country: string;
  status?: boolean;
  [key: string]: any;
}

export interface AirlineFilters {
  status?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
