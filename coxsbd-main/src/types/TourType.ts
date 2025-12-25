export interface TourType {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    tours: number;
  };
  [key: string]: any;
}

export interface TourTypesMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface TourTypesResult {
  tourTypes: TourType[];
  meta: TourTypesMeta;
}

export interface TourTypePayload {
  name: string;
  [key: string]: any;
}

export interface TourTypeFilters {
  name?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
