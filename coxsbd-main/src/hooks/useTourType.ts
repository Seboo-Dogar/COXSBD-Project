"use client";

import { TourType, TourTypeFilters, TourTypePayload, TourTypesResult } from "@/types/TourType";
import axiosConfig from "@/utils/axiosConfig";
import { TOUR_TYPE_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useTourTypes(filters?: TourTypeFilters) {
  return useQuery<TourTypesResult>({
    queryKey: ["tour-types", filters],
    queryFn: async () => {
      const res = await axiosClient.get(TOUR_TYPE_API, {
        params: {
          name: filters?.name,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as TourTypesResult;
    },
  });
}

export function useInfiniteTourTypes(limit: number = 20) {
  return useInfiniteQuery<TourTypesResult>({
    queryKey: ["tour-types", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(TOUR_TYPE_API, {
        params: { page: pageParam, limit },
      });

      return res.data as TourTypesResult;
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

export function useAllTourTypes() {
  return useQuery<TourType[]>({
    queryKey: ["tour-types", "all"],
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_TYPE_API}/all`);
      return res.data as TourType[];
    },
  });
}

export function useTourTypeById(tourTypeId: string | null, enabled = true) {
  return useQuery<TourType>({
    queryKey: ["tour-type", tourTypeId],
    enabled: Boolean(tourTypeId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_TYPE_API}/${tourTypeId}`);
      return res.data as TourType;
    },
  });
}

export function useTourTypeByName(name: string | null, enabled = true) {
  return useQuery<TourType>({
    queryKey: ["tour-type", "name", name],
    enabled: Boolean(name) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${TOUR_TYPE_API}/name/${name}`);
      return res.data as TourType;
    },
  });
}

export function useCreateTourType(onSuccessCallback?: (created: TourType) => void) {
  return useMutation({
    mutationFn: async (payload: TourTypePayload) => {
      const res = await axiosClient.post(TOUR_TYPE_API, payload);
      return res.data as TourType;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tour-types"] });
      queryClient.invalidateQueries({ queryKey: ["tour-types", "all"] });
      queryClient.setQueryData(["tour-type", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateTourType(onSuccessCallback?: (updated: TourType) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<TourTypePayload>;
    }) => {
      const res = await axiosClient.put(`${TOUR_TYPE_API}/${id}`, payload);
      return res.data as TourType;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tour-type", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["tour-types"] });
      queryClient.invalidateQueries({ queryKey: ["tour-types", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-type", "name"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteTourType(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${TOUR_TYPE_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["tour-type", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["tour-types"] });
      queryClient.invalidateQueries({ queryKey: ["tour-types", "all"] });
      queryClient.invalidateQueries({ queryKey: ["tour-type", "name"] });
      onSuccessCallback?.();
    },
  });
}
