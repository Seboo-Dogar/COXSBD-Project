"use client";

import { TourSuggestion, TourSuggestionFilters, TourSuggestionPayload, TourSuggestionsResult } from "@/types/TourSuggestion";
import axiosConfig from "@/utils/axiosConfig";
import { TOUR_SUGGESTION_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useTourSuggestions(filters?: TourSuggestionFilters) {
  return useQuery<TourSuggestionsResult>({
    queryKey: ["tour-suggestions", filters],
    queryFn: async () => {
      const res = await axiosClient.get(TOUR_SUGGESTION_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          city: filters?.city,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as TourSuggestionsResult;
    },
  });
}

export function useInfiniteTourSuggestions(limit: number = 20) {
  return useInfiniteQuery<TourSuggestionsResult>({
    queryKey: ["tour-suggestions", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(TOUR_SUGGESTION_API, {
        params: { page: pageParam, limit },
      });

      return res.data as TourSuggestionsResult;
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

export function useActiveTourSuggestions(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<TourSuggestionsResult>({
    queryKey: ["tour-suggestions", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_SUGGESTION_API}/active`, {
        params,
      });
      return res.data as TourSuggestionsResult;
    },
  });
}

export function useTourSuggestionById(tourSuggestionId: string | null, enabled = true) {
  return useQuery<TourSuggestion>({
    queryKey: ["tour-suggestion", tourSuggestionId],
    enabled: Boolean(tourSuggestionId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_SUGGESTION_API}/${tourSuggestionId}`);
      return res.data as TourSuggestion;
    },
  });
}

export function useCreateTourSuggestion(onSuccessCallback?: (created: TourSuggestion) => void) {
  return useMutation({
    mutationFn: async (payload: TourSuggestionPayload) => {
      const res = await axiosClient.post(TOUR_SUGGESTION_API, payload);
      return res.data as TourSuggestion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions", "active"] });
      queryClient.setQueryData(["tour-suggestion", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateTourSuggestion(onSuccessCallback?: (updated: TourSuggestion) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TourSuggestionPayload>;
    }) => {
      const res = await axiosClient.put(`${TOUR_SUGGESTION_API}/${id}`, payload);
      return res.data as TourSuggestion;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tour-suggestion", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteTourSuggestion(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${TOUR_SUGGESTION_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["tour-suggestion", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-suggestions", "active"] });
      onSuccessCallback?.();
    },
  });
}
