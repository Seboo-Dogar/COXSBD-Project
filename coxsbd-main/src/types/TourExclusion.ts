export interface TourExclusion {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    tours: number;
  };
  [key: string]: any;
}

export interface TourExclusionsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  skip: number;
}

export interface TourExclusionsResult {
  tourExclusions: TourExclusion[];
  meta: TourExclusionsMeta;
}

export interface TourExclusionPayload {
  name: string;
  [key: string]: any;
}

export interface TourExclusionFilters {
  name?: string;
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}
