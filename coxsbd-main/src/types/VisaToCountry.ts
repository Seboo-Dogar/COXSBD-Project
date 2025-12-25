export interface VisaToCountry {
  id: string;
  country: string;
  status: boolean;
  nicename: string;
  iso: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    visaBookings: number;
  };
  [key: string]: any;
}

export interface VisaToCountriesMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface VisaToCountriesResult {
  visaToCountries: VisaToCountry[];
  meta: VisaToCountriesMeta;
}

export interface VisaToCountryPayload {
  country: string;
  nicename: string;
  iso: string;
  status?: boolean;
  [key: string]: any;
}

export interface VisaToCountryFilters {
  status?: boolean;
  country?: string;
  nicename?: string;
  iso?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
