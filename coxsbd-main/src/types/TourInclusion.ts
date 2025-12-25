export interface TourInclusion {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    tours: number;
  };
  [key: string]: any;
}

export interface TourInclusionsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface TourInclusionsResult {
  tourInclusions: TourInclusion[];
  meta: TourInclusionsMeta;
}

export interface TourInclusionPayload {
  name: string;
  [key: string]: any;
}

export interface TourInclusionFilters {
  name?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
