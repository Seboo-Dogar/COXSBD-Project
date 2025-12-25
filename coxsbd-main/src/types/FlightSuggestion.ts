export type SuggestionType = "FROM_DESTINATION" | "TO_DESTINATION";

export interface FlightSuggestion {
  id: string;
  type: SuggestionType;
  cityAirport: string;
  order: number;
  status?: boolean;
  [key: string]: any;
}

export interface FlightSuggestionsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface FlightSuggestionsResult {
  flightSuggestions: FlightSuggestion[];
  meta: FlightSuggestionsMeta;
}

export interface FlightSuggestionPayload {
  type: SuggestionType;
  cityAirport: string;
  order: number;
  status?: boolean;
  [key: string]: any;
}

export interface FlightSuggestionFilters {
  status?: boolean;
  type?: SuggestionType;
  cityAirport?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
