"use client";

import { FlightSuggestion, FlightSuggestionFilters, FlightSuggestionPayload, FlightSuggestionsResult } from "@/types/FlightSuggestion";
import axiosConfig from "@/utils/axiosConfig";
import { FLIGHT_SUGGESTION_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useFlightSuggestions(filters?: FlightSuggestionFilters) {
  return useQuery<FlightSuggestionsResult>({
    queryKey: ["flight-suggestion", filters],
    queryFn: async () => {
      const res = await axiosClient.get(FLIGHT_SUGGESTION_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          type: filters?.type,
          cityAirport: filters?.cityAirport,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as FlightSuggestionsResult;
    },
  });
}

export function useInfiniteFlightSuggestions(limit: number = 20) {
  return useInfiniteQuery<FlightSuggestionsResult>({
    queryKey: ["flight-suggestion", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(FLIGHT_SUGGESTION_API, {
        params: { page: pageParam, limit },
      });

      return res.data as FlightSuggestionsResult;
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

export function useActiveFlightSuggestions(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<FlightSuggestionsResult>({
    queryKey: ["flight-suggestion", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHT_SUGGESTION_API}/active`, {
        params,
      });
      return res.data as FlightSuggestionsResult;
    },
  });
}

export function useFlightSuggestionById(flightSuggestionId: string | null, enabled = true) {
  return useQuery<FlightSuggestion>({
    queryKey: ["flight-suggestion", flightSuggestionId],
    enabled: Boolean(flightSuggestionId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${FLIGHT_SUGGESTION_API}/${flightSuggestionId}`);
      return res.data as FlightSuggestion;
    },
  });
}

export function useCreateFlightSuggestion(onSuccessCallback?: (created: FlightSuggestion) => void) {
  return useMutation({
    mutationFn: async (payload: FlightSuggestionPayload) => {
      const res = await axiosClient.post(FLIGHT_SUGGESTION_API, payload);
      return res.data as FlightSuggestion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion"] });
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion", "active"] });
      queryClient.setQueryData(["flight-suggestion", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateFlightSuggestion(onSuccessCallback?: (updated: FlightSuggestion) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<FlightSuggestionPayload>;
    }) => {
      const res = await axiosClient.put(`${FLIGHT_SUGGESTION_API}/${id}`, payload);
      return res.data as FlightSuggestion;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["flight-suggestion", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion"] });
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteFlightSuggestion(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${FLIGHT_SUGGESTION_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["flight-suggestion", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion"] });
      queryClient.invalidateQueries({ queryKey: ["flight-suggestion", "active"] });
      onSuccessCallback?.();
    },
  });
}
