"use client";

import {
  VisaFromCountry,
  VisaFromCountryFilters,
  VisaFromCountryPayload,
  VisaFromCountriesResult,
} from "@/types/VisaFromCountry";
import axiosConfig from "@/utils/axiosConfig";
import { VISA_FROM_COUNTRY_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useVisaFromCountries(filters?: VisaFromCountryFilters) {
  return useQuery<VisaFromCountriesResult>({
    queryKey: ["visa-from-countries", filters],
    queryFn: async () => {
      const res = await axiosClient.get(VISA_FROM_COUNTRY_API, {
        params: {
          status: filters?.status,
          country: filters?.country,
          nicename: filters?.nicename,
          iso: filters?.iso,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaFromCountriesResult;
    },
  });
}

export function useInfiniteVisaFromCountries(limit: number = 20) {
  return useInfiniteQuery<VisaFromCountriesResult>({
    queryKey: ["visa-from-countries", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(VISA_FROM_COUNTRY_API, {
        params: { page: pageParam, limit },
      });

      return res.data as VisaFromCountriesResult;
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

export function useActiveVisaFromCountries(filters?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<VisaFromCountriesResult>({
    queryKey: ["visa-from-countries", "active", filters],
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_FROM_COUNTRY_API}/active`, {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaFromCountriesResult;
    },
  });
}

export function useAllVisaFromCountries() {
  return useQuery<VisaFromCountry[]>({
    queryKey: ["visa-from-countries", "all"],
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_FROM_COUNTRY_API}/all`);
      return res.data as VisaFromCountry[];
    },
  });
}

export function useVisaFromCountryById(visaFromCountryId: string | null, enabled = true) {
  return useQuery<VisaFromCountry>({
    queryKey: ["visa-from-country", visaFromCountryId],
    enabled: Boolean(visaFromCountryId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_FROM_COUNTRY_API}/${visaFromCountryId}`);
      return res.data as VisaFromCountry;
    },
  });
}

export function useVisaFromCountryByIso(iso: string | null, enabled = true) {
  return useQuery<VisaFromCountry>({
    queryKey: ["visa-from-country", "iso", iso],
    enabled: Boolean(iso) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_FROM_COUNTRY_API}/iso/${iso}`);
      return res.data as VisaFromCountry;
    },
  });
}

export function useCreateVisaFromCountry(
  onSuccessCallback?: (created: VisaFromCountry) => void
) {
  return useMutation({
    mutationFn: async (payload: VisaFromCountryPayload) => {
      const res = await axiosClient.post(VISA_FROM_COUNTRY_API, payload);
      return res.data as VisaFromCountry;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "active"] });
      queryClient.setQueryData(["visa-from-country", data.id], data);
      queryClient.setQueryData(["visa-from-country", "iso", data.iso], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateVisaFromCountry(
  onSuccessCallback?: (updated: VisaFromCountry) => void
) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VisaFromCountryPayload>;
    }) => {
      const res = await axiosClient.put(`${VISA_FROM_COUNTRY_API}/${id}`, payload);
      return res.data as VisaFromCountry;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["visa-from-country", data.id], data);
      queryClient.setQueryData(["visa-from-country", "iso", data.iso], data);
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteVisaFromCountry(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`${VISA_FROM_COUNTRY_API}/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["visa-from-country", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-countries", "active"] });
      queryClient.invalidateQueries({ queryKey: ["visa-from-country", "iso"] });
      onSuccessCallback?.();
    },
  });
}
