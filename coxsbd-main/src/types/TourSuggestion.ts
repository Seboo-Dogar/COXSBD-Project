export interface TourSuggestion {
  id: string;
  city: string;
  order: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface TourSuggestionsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface TourSuggestionsResult {
  tourSuggestions: TourSuggestion[];
  meta: TourSuggestionsMeta;
}

export interface TourSuggestionPayload {
  city: string;
  order: number;
  status?: boolean;
  [key: string]: any;
}

export interface TourSuggestionFilters {
  status?: boolean;
  city?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
