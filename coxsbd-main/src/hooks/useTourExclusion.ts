"use client";

import { TourExclusion, TourExclusionFilters, TourExclusionPayload, TourExclusionsResult } from "@/types/TourExclusion";
import axiosConfig from "@/utils/axiosConfig";
import { TOUR_EXCLUSION_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useTourExclusions(filters?: TourExclusionFilters) {
  return useQuery<TourExclusionsResult>({
    queryKey: ["tour-exclusions", filters],
    queryFn: async () => {
      const res = await axiosClient.get(TOUR_EXCLUSION_API, {
        params: {
          name: filters?.name,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as TourExclusionsResult;
    },
  });
}

export function useInfiniteTourExclusions(limit: number = 20) {
  return useInfiniteQuery<TourExclusionsResult>({
    queryKey: ["tour-exclusions", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(TOUR_EXCLUSION_API, {
        params: { page: pageParam, limit },
      });

      return res.data as TourExclusionsResult;
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

export function useAllTourExclusions() {
  return useQuery<TourExclusion[]>({
    queryKey: ["tour-exclusions", "all"],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_EXCLUSION_API}/all`);
      return res.data as TourExclusion[];
    },
  });
}

export function useTourExclusionById(tourExclusionId: string | null, enabled = true) {
  return useQuery<TourExclusion>({
    queryKey: ["tour-exclusion", tourExclusionId],
    enabled: Boolean(tourExclusionId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_EXCLUSION_API}/${tourExclusionId}`);
      return res.data as TourExclusion;
    },
  });
}

export function useTourExclusionByName(name: string | null, enabled = true) {
  return useQuery<TourExclusion>({
    queryKey: ["tour-exclusion", "name", name],
    enabled: Boolean(name) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_EXCLUSION_API}/name/${name}`);
      return res.data as TourExclusion;
    },
  });
}

export function useCreateTourExclusion(onSuccessCallback?: (created: TourExclusion) => void) {
  return useMutation({
    mutationFn: async (payload: TourExclusionPayload) => {
      const res = await axiosClient.post(TOUR_EXCLUSION_API, payload);
      return res.data as TourExclusion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions", "all"] });
      queryClient.setQueryData(["tour-exclusion", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateTourExclusion(onSuccessCallback?: (updated: TourExclusion) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TourExclusionPayload>;
    }) => {
      const res = await axiosClient.put(`${TOUR_EXCLUSION_API}/${id}`, payload);
      return res.data as TourExclusion;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tour-exclusion", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-exclusion", "name"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteTourExclusion(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${TOUR_EXCLUSION_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["tour-exclusion", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-exclusions", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-exclusion", "name"] });
      onSuccessCallback?.();
    },
  });
}
