"use client";

import { Airport, AirportFilters, AirportPayload, AirportsResult } from "@/types/Airport";
import axiosConfig from "@/utils/axiosConfig";
import { AIRPORTS_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useAirports(filters?: AirportFilters) {
  return useQuery<AirportsResult>({
    queryKey: ["airports", filters],
    queryFn: async () => {
      const res = await axiosClient.get(AIRPORTS_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          country: filters?.country,
          city: filters?.city,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as AirportsResult;
    },
  });
}

export function useInfiniteAirports(limit: number = 20) {
  return useInfiniteQuery<AirportsResult>({
    queryKey: ["airports", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(AIRPORTS_API, {
        params: { page: pageParam, limit },
      });

      return res.data as AirportsResult;
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

export function useActiveAirports(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<AirportsResult>({
    queryKey: ["airports", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${AIRPORTS_API}/active`, {
        params,
      });
      return res.data as AirportsResult;
    },
  });
}

export function useAirportById(airportId: string | null, enabled = true) {
  return useQuery<Airport>({
    queryKey: ["airport", airportId],
    enabled: Boolean(airportId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${AIRPORTS_API}/${airportId}`);
      return res.data as Airport;
    },
  });
}

export function useAirportByCode(code: string | null, enabled = true) {
  return useQuery<Airport>({
    queryKey: ["airport", "code", code],
    enabled: Boolean(code) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${AIRPORTS_API}/code/${code}`);
      return res.data as Airport;
    },
  });
}

export function useCreateAirport(onSuccessCallback?: (created: Airport) => void) {
  return useMutation({
    mutationFn: async (payload: AirportPayload) => {
      const res = await axiosClient.post(AIRPORTS_API, payload);
      return res.data as Airport;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["airports"] });
      queryClient.invalidateQueries({ queryKey: ["airports", "active"] });
      queryClient.setQueryData(["airport", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateAirport(onSuccessCallback?: (updated: Airport) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AirportPayload>;
    }) => {
      const res = await axiosClient.put(`${AIRPORTS_API}/${id}`, payload);
      return res.data as Airport;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["airport", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["airports"] });
      queryClient.invalidateQueries({ queryKey: ["airports", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteAirport(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${AIRPORTS_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["airport", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["airports"] });
      queryClient.invalidateQueries({ queryKey: ["airports", "active"] });
      onSuccessCallback?.();
    },
  });
}
