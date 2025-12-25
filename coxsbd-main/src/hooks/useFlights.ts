"use client";

import { Flight, FlightFilters, FlightPayload, FlightsResult } from "@/types/Flight";
import axiosConfig from "@/utils/axiosConfig";
import { FLIGHTS_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useFlights(filters?: FlightFilters) {
  return useQuery<FlightsResult>({
    queryKey: ["flights", filters],
    queryFn: async () => {
      const res = await axiosClient.get(FLIGHTS_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          userId: filters?.userId,
          airlineId: filters?.airlineId,
          fromAirportId: filters?.fromAirportId,
          toAirportId: filters?.toAirportId,
          type: filters?.type,
          offer:
            typeof filters?.offer === "boolean"
              ? String(filters.offer)
              : undefined,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as FlightsResult;
    },
  });
}

export function useInfiniteFlights(limit: number = 20) {
  return useInfiniteQuery<FlightsResult>({
    queryKey: ["flights", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(FLIGHTS_API, {
        params: { page: pageParam, limit },
      });

      return res.data as FlightsResult;
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

export function useActiveFlights(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<FlightsResult>({
    queryKey: ["flights", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHTS_API}/active`, {
        params,
      });
      return res.data as FlightsResult;
    },
  });
}

export function useFlightsWithOffers(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<FlightsResult>({
    queryKey: ["flights", "offers", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHTS_API}/offers`, {
        params,
      });
      return res.data as FlightsResult;
    },
  });
}

export function useFlightById(flightId: string | number | null, enabled = true) {
  return useQuery<Flight>({
    queryKey: ["flight", flightId],
    enabled: Boolean(flightId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHTS_API}/${flightId}`);
      return res.data as Flight;
    },
  });
}

export function useCreateFlight(onSuccessCallback?: (created: Flight) => void) {
  return useMutation({
    mutationFn: async (payload: FlightPayload) => {
      const res = await axiosClient.post(FLIGHTS_API, payload);
      return res.data as Flight;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights", "active"] });
      queryClient.setQueryData(["flight", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateFlight(onSuccessCallback?: (updated: Flight) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string | number;
      payload: Partial<FlightPayload>;
    }) => {
      const res = await axiosClient.put(`${FLIGHTS_API}/${id}`, payload);
      return res.data as Flight;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["flight", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteFlight(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await axiosClient.delete(`${FLIGHTS_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["flight", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      queryClient.invalidateQueries({ queryKey: ["flights", "active"] });
      onSuccessCallback?.();
    },
  });
}
