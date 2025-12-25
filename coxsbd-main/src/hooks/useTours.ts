"use client";

import { Tour, TourFilters, TourPayload, ToursResult } from "@/types/Tour";
import axiosConfig from "@/utils/axiosConfig";
import { TOURS_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useTours(filters?: TourFilters) {
  return useQuery<ToursResult>({
    queryKey: ["tours", filters],
    queryFn: async () => {
      const res = await axiosClient.get(TOURS_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          featured:
            typeof filters?.featured === "boolean"
              ? String(filters.featured)
              : undefined,
          offer:
            typeof filters?.offer === "boolean"
              ? String(filters.offer)
              : undefined,
          tourTypeId: filters?.tourTypeId,
          userId: filters?.userId,
          location: filters?.location,
          minRating: filters?.minRating,
          maxRating: filters?.maxRating,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as ToursResult;
    },
  });
}

export function useInfiniteTours(limit: number = 20) {
  return useInfiniteQuery<ToursResult>({
    queryKey: ["tours", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(TOURS_API, {
        params: { page: pageParam, limit },
      });

      return res.data as ToursResult;
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage.meta) return undefined;
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return (lastPageParam as number) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useActiveTours(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<ToursResult>({
    queryKey: ["tours", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOURS_API}/active`, {
        params,
      });
      return res.data as ToursResult;
    },
  });
}

export function useFeaturedTours(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<ToursResult>({
    queryKey: ["tours", "featured", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOURS_API}/featured`, {
        params,
      });
      return res.data as ToursResult;
    },
  });
}

export function useToursWithOffers(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<ToursResult>({
    queryKey: ["tours", "offers", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOURS_API}/offers`, {
        params,
      });
      return res.data as ToursResult;
    },
  });
}

export function useTourById(tourId: string | null, enabled = true) {
  return useQuery<Tour>({
    queryKey: ["tour", tourId],
    enabled: Boolean(tourId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOURS_API}/${tourId}`);
      return res.data as Tour;
    },
  });
}

export function useCreateTour(onSuccessCallback?: (created: Tour) => void) {
  return useMutation({
    mutationFn: async (payload: TourPayload) => {
      const res = await axiosClient.post(TOURS_API, payload);
      return res.data as Tour;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "active"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "featured"] });
      queryClient.setQueryData(["tour", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateTour(onSuccessCallback?: (updated: Tour) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TourPayload>;
    }) => {
      const res = await axiosClient.put(`${TOURS_API}/${id}`, payload);
      return res.data as Tour;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tour", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "active"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "featured"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteTour(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${TOURS_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["tour", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "active"] });
      queryClient.invalidateQueries({ queryKey: ["tours", "featured"] });
      onSuccessCallback?.();
    },
  });
}
