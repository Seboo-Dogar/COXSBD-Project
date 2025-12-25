"use client";

import { Airline, AirlineFilters, AirlinePayload, AirlinesResult } from "@/types/Airline";
import axiosConfig from "@/utils/axiosConfig";
import { AIRLINES_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useAirlines(filters?: AirlineFilters) {
  return useQuery<AirlinesResult>({
    queryKey: ["airlines", filters],
    queryFn: async () => {
      const res = await axiosClient.get(AIRLINES_API, {
        params: {
          status:
            typeof filters?.status === "boolean"
              ? String(filters.status)
              : undefined,
          search: filters?.search,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as AirlinesResult;
    },
  });
}

export function useInfiniteAirlines(limit: number = 20) {
  return useInfiniteQuery<AirlinesResult>({
    queryKey: ["airlines", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(AIRLINES_API, {
        params: { page: pageParam, limit },
      });

      return res.data as AirlinesResult;
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

export function useActiveAirlines(params?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<AirlinesResult>({
    queryKey: ["airlines", "active", params],
    queryFn: async () => {
      const res = await axiosClient.get(`${AIRLINES_API}/active`, {
        params,
      });
      return res.data as AirlinesResult;
    },
  });
}

export function useAirlineById(airlineId: string | null, enabled = true) {
  return useQuery<Airline>({
    queryKey: ["airline", airlineId],
    enabled: Boolean(airlineId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${AIRLINES_API}/${airlineId}`);
      return res.data as Airline;
    },
  });
}

export function useCreateAirline(onSuccessCallback?: (created: Airline) => void) {
  return useMutation({
    mutationFn: async (payload: AirlinePayload) => {
      const res = await axiosClient.post(AIRLINES_API, payload);
      return res.data as Airline;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["airlines"] });
      queryClient.invalidateQueries({ queryKey: ["airlines", "active"] });
      queryClient.setQueryData(["airline", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateAirline(onSuccessCallback?: (updated: Airline) => void) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AirlinePayload>;
    }) => {
      const res = await axiosClient.put(`${AIRLINES_API}/${id}`, payload);
      return res.data as Airline;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["airline", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["airlines"] });
      queryClient.invalidateQueries({ queryKey: ["airlines", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteAirline(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosClient.delete(`${AIRLINES_API}/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["airline", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["airlines"] });
      queryClient.invalidateQueries({ queryKey: ["airlines", "active"] });
      onSuccessCallback?.();
    },
  });
}
