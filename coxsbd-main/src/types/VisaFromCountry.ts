export interface VisaFromCountry {
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

export interface VisaFromCountriesMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface VisaFromCountriesResult {
  visaFromCountries: VisaFromCountry[];
  meta: VisaFromCountriesMeta;
}

export interface VisaFromCountryPayload {
  country: string;
  nicename: string;
  iso: string;
  status?: boolean;
  [key: string]: any;
}

export interface VisaFromCountryFilters {
  status?: boolean;
  country?: string;
  nicename?: string;
  iso?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
