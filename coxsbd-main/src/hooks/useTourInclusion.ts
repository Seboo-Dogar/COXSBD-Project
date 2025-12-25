"use client";

import { TourInclusion, TourInclusionFilters, TourInclusionPayload, TourInclusionsResult } from "@/types/TourInclusion";
import axiosConfig from "@/utils/axiosConfig";
import { TOUR_INCLUSION_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useTourInclusions(filters?: TourInclusionFilters) {
  return useQuery<TourInclusionsResult>({
    queryKey: ["tour-inclusions", filters],
    queryFn: async () => {
      const res = await axiosClient.get(TOUR_INCLUSION_API, {
        params: {
          name: filters?.name,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as TourInclusionsResult;
    },
  });
}

export function useInfiniteTourInclusions(limit: number = 20) {
  return useInfiniteQuery<TourInclusionsResult>({
    queryKey: ["tour-inclusions", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(TOUR_INCLUSION_API, {
        params: { page: pageParam, limit },
      });

      return res.data as TourInclusionsResult;
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

export function useAllTourInclusions() {
  return useQuery<TourInclusion[]>({
    queryKey: ["tour-inclusions", "all"],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_INCLUSION_API}/all`);
      return res.data as TourInclusion[];
    },
  });
}

export function useTourInclusionById(tourInclusionId: string | null, enabled = true) {
  return useQuery<TourInclusion>({
    queryKey: ["tour-inclusion", tourInclusionId],
    enabled: Boolean(tourInclusionId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_INCLUSION_API}/${tourInclusionId}`);
      return res.data as TourInclusion;
    },
  });
}

export function useTourInclusionByName(name: string | null, enabled = true) {
  return useQuery<TourInclusion>({
    queryKey: ["tour-inclusion", "name", name],
    enabled: Boolean(name) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_INCLUSION_API}/name/${name}`);
      return res.data as TourInclusion;
    },
  });
}

export function useCreateTourInclusion(onSuccessCallback?: (created: TourInclusion) => void) {
  return useMutation({
    mutationFn: async (payload: TourInclusionPayload) => {
      const res = await axiosClient.post(TOUR_INCLUSION_API, payload);
      return res.data as TourInclusion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions", "all"] });
      queryClient.setQueryData(["tour-inclusion", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateTourInclusion(onSuccessCallback?: (updated: TourInclusion) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TourInclusionPayload>;
    }) => {
      const res = await axiosClient.put(`${TOUR_INCLUSION_API}/${id}`, payload);
      return res.data as TourInclusion;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tour-inclusion", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-inclusion", "name"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteTourInclusion(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${TOUR_INCLUSION_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["tour-inclusion", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions"] });
      queryClient.invalidateQueries({ queryKey: ["tour-inclusions", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-inclusion", "name"] });
      onSuccessCallback?.();
    },
  });
}
