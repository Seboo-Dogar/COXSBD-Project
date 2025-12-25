"use client";

import { FlightFeatured, FlightFeaturedFilters, FlightFeaturedPayload, FlightFeaturedsResult } from "@/types/FlightFeatured";
import axiosConfig from "@/utils/axiosConfig";
import { FLIGHT_FEATURED_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useFlightFeatureds(filters?: FlightFeaturedFilters) {
  return useQuery<FlightFeaturedsResult>({
    queryKey: ["flight-featured", filters],
    queryFn: async () => {
      const res = await axiosClient.get(FLIGHT_FEATURED_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          airlineId: filters?.airlineId,
          fromAirportId: filters?.fromAirportId,
          toAirportId: filters?.toAirportId,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as FlightFeaturedsResult;
    },
  });
}

export function useInfiniteFlightFeatureds(limit: number = 20) {
  return useInfiniteQuery<FlightFeaturedsResult>({
    queryKey: ["flight-featured", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(FLIGHT_FEATURED_API, {
        params: { page: pageParam, limit },
      });

      return res.data as FlightFeaturedsResult;
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

export function useActiveFlightFeatureds(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<FlightFeaturedsResult>({
    queryKey: ["flight-featured", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHT_FEATURED_API}/active`, {
        params,
      });
      return res.data as FlightFeaturedsResult;
    },
  });
}

export function useFlightFeaturedById(flightFeaturedId: string | null, enabled = true) {
  return useQuery<FlightFeatured>({
    queryKey: ["flight-featured", flightFeaturedId],
    enabled: Boolean(flightFeaturedId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHT_FEATURED_API}/${flightFeaturedId}`);
      return res.data as FlightFeatured;
    },
  });
}

export function useCreateFlightFeatured(onSuccessCallback?: (created: FlightFeatured) => void) {
  return useMutation({
    mutationFn: async (payload: FlightFeaturedPayload) => {
      const res = await axiosClient.post(FLIGHT_FEATURED_API, payload);
      return res.data as FlightFeatured;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["flight-featured"] });
      queryClient.invalidateQueries({ queryKey: ["flight-featured", "active"] });
      queryClient.setQueryData(["flight-featured", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateFlightFeatured(onSuccessCallback?: (updated: FlightFeatured) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<FlightFeaturedPayload>;
    }) => {
      const res = await axiosClient.put(`${FLIGHT_FEATURED_API}/${id}`, payload);
      return res.data as FlightFeatured;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["flight-featured", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["flight-featured"] });
      queryClient.invalidateQueries({ queryKey: ["flight-featured", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteFlightFeatured(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${FLIGHT_FEATURED_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["flight-featured", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["flight-featured"] });
      queryClient.invalidateQueries({ queryKey: ["flight-featured", "active"] });
      onSuccessCallback?.();
    },
  });
}
