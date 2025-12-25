"use client";

import {
  VisaToCountry,
  VisaToCountryFilters,
  VisaToCountryPayload,
  VisaToCountriesResult,
} from "@/types/VisaToCountry";
import axiosConfig from "@/utils/axiosConfig";
import { VISA_TO_COUNTRY_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useVisaToCountries(filters?: VisaToCountryFilters) {
  return useQuery<VisaToCountriesResult>({
    queryKey: ["visa-to-countries", filters],
    queryFn: async () => {
      const res = await axiosClient.get(VISA_TO_COUNTRY_API, {
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

      return res.data as VisaToCountriesResult;
    },
  });
}

export function useInfiniteVisaToCountries(limit: number = 20) {
  return useInfiniteQuery<VisaToCountriesResult>({
    queryKey: ["visa-to-countries", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(VISA_TO_COUNTRY_API, {
        params: { page: pageParam, limit },
      });

      return res.data as VisaToCountriesResult;
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

export function useActiveVisaToCountries(filters?: { page?: number; limit?: number; skip?: number; take?: number }) {
  return useQuery<VisaToCountriesResult>({
    queryKey: ["visa-to-countries", "active", filters],
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_TO_COUNTRY_API}/active`, {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaToCountriesResult;
    },
  });
}

export function useAllVisaToCountries() {
  return useQuery<VisaToCountry[]>({
    queryKey: ["visa-to-countries", "all"],
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_TO_COUNTRY_API}/all`);
      return res.data as VisaToCountry[];
    },
  });
}

export function useVisaToCountryById(visaToCountryId: string | null, enabled = true) {
  return useQuery<VisaToCountry>({
    queryKey: ["visa-to-country", visaToCountryId],
    enabled: Boolean(visaToCountryId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_TO_COUNTRY_API}/${visaToCountryId}`);
      return res.data as VisaToCountry;
    },
  });
}

export function useVisaToCountryByIso(iso: string | null, enabled = true) {
  return useQuery<VisaToCountry>({
    queryKey: ["visa-to-country", "iso", iso],
    enabled: Boolean(iso) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_TO_COUNTRY_API}/iso/${iso}`);
      return res.data as VisaToCountry;
    },
  });
}

export function useCreateVisaToCountry(
  onSuccessCallback?: (created: VisaToCountry) => void
) {
  return useMutation({
    mutationFn: async (payload: VisaToCountryPayload) => {
      const res = await axiosClient.post(VISA_TO_COUNTRY_API, payload);
      return res.data as VisaToCountry;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "active"] });
      queryClient.setQueryData(["visa-to-country", data.id], data);
      queryClient.setQueryData(["visa-to-country", "iso", data.iso], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateVisaToCountry(
  onSuccessCallback?: (updated: VisaToCountry) => void
) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VisaToCountryPayload>;
    }) => {
      const res = await axiosClient.put(`${VISA_TO_COUNTRY_API}/${id}`, payload);
      return res.data as VisaToCountry;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["visa-to-country", data.id], data);
      queryClient.setQueryData(["visa-to-country", "iso", data.iso], data);
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "active"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteVisaToCountry(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`${VISA_TO_COUNTRY_API}/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["visa-to-country", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "all"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-countries", "active"] });
      queryClient.invalidateQueries({ queryKey: ["visa-to-country", "iso"] });
      onSuccessCallback?.();
    },
  });
}
