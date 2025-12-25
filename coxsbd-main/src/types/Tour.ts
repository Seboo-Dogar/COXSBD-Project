export type CurrencyCode = "BDT" | "USD" | "EUR" | "INR" | "GBP";

export interface Tour {
  id: string;
  status: boolean;
  featured: boolean;
  offer?: boolean;
  tourTypeId: string;
  name: string;
  currency?: CurrencyCode;
  userId: string;
  refundable: boolean;
  stars?: number;
  rating?: number;
  adultPrice: number;
  childPrice: number;
  maxAdults: number;
  maxChild: number;
  description: string;
  policy: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
  tourType?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    email: string;
  } | null;
  inclusions?: Array<{
    id: string;
    name: string;
  }>;
  exclusions?: Array<{
    id: string;
    name: string;
  }>;
  [key: string]: any;
}

export interface ToursMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface ToursResult {
  tours: Tour[];
  meta: ToursMeta;
}

export interface TourPayload {
  tourTypeId: string;
  name: string;
  userId: string;
  location: string;
  adultPrice: number;
  childPrice: number;
  maxAdults: number;
  maxChild: number;
  description: string;
  policy: string;
  currency?: CurrencyCode;
  status?: boolean;
  featured?: boolean;
  refundable?: boolean;
  offer?: boolean;
  stars?: number;
  rating?: number;
  inclusions?: string[];
  exclusions?: string[];
  [key: string]: any;
}

export interface TourFilters {
  status?: boolean;
  featured?: boolean;
  offer?: boolean;
  tourTypeId?: string;
  userId?: string;
  location?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
