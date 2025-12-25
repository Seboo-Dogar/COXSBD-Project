"use client";

import {
  VisaBooking,
  VisaBookingFilters,
  VisaBookingPayload,
  VisaBookingsResult,
  VisaStatus,
} from "@/types/VisaBooking";
import axiosConfig from "@/utils/axiosConfig";
import { VISA_BOOKING_API } from "@/utils/endpoints";
import { queryClient } from "@/utils/queryClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useVisaBookings(filters?: VisaBookingFilters) {
  return useQuery<VisaBookingsResult>({
    queryKey: ["visa-bookings", filters],
    queryFn: async () => {
      const res = await axiosClient.get(VISA_BOOKING_API, {
        params: {
          status: filters?.status,
          fromCountryId: filters?.fromCountryId,
          toCountryId: filters?.toCountryId,
          email: filters?.email,
          phone: filters?.phone,
          date: filters?.date,
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaBookingsResult;
    },
  });
}

export function useInfiniteVisaBookings(limit: number = 20) {
  return useInfiniteQuery<VisaBookingsResult>({
    queryKey: ["visa-bookings", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(VISA_BOOKING_API, {
        params: { page: pageParam, limit },
      });

      return res.data as VisaBookingsResult;
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

export function useVisaBookingsByStatus(
  status: VisaStatus | null,
  filters?: { page?: number; limit?: number; skip?: number; take?: number },
  enabled = true
) {
  return useQuery<VisaBookingsResult>({
    queryKey: ["visa-bookings", "status", status, filters],
    enabled: Boolean(status) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_BOOKING_API}/status/${status}`, {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaBookingsResult;
    },
  });
}

export function useVisaBookingsByEmail(
  email: string | null,
  filters?: { page?: number; limit?: number; skip?: number; take?: number },
  enabled = true
) {
  return useQuery<VisaBookingsResult>({
    queryKey: ["visa-bookings", "email", email, filters],
    enabled: Boolean(email) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_BOOKING_API}/email/${email}`, {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as VisaBookingsResult;
    },
  });
}

export function useVisaBookingById(visaBookingId: string | null, enabled = true) {
  return useQuery<VisaBooking>({
    queryKey: ["visa-booking", visaBookingId],
    enabled: Boolean(visaBookingId) && enabled,
    queryFn: async () => {
      const res = await axiosClient.get(`${VISA_BOOKING_API}/${visaBookingId}`);
      return res.data as VisaBooking;
    },
  });
}

export function useCreateVisaBooking(
  onSuccessCallback?: (created: VisaBooking) => void
) {
  return useMutation({
    mutationFn: async (payload: VisaBookingPayload) => {
      const res = await axiosClient.post(VISA_BOOKING_API, payload);
      return res.data as VisaBooking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["visa-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "status"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "email"] });
      queryClient.setQueryData(["visa-booking", data.id], data);
      onSuccessCallback?.(data);
    },
  });
}

export function useUpdateVisaBooking(
  onSuccessCallback?: (updated: VisaBooking) => void
) {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<VisaBookingPayload>;
    }) => {
      const res = await axiosClient.put(`${VISA_BOOKING_API}/${id}`, payload);
      return res.data as VisaBooking;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["visa-booking", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["visa-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "status"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "email"] });
      onSuccessCallback?.(data);
    },
  });
}

export function useDeleteVisaBooking(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosClient.delete(`${VISA_BOOKING_API}/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["visa-booking", id], undefined);
      queryClient.invalidateQueries({ queryKey: ["visa-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "status"] });
      queryClient.invalidateQueries({ queryKey: ["visa-bookings", "email"] });
      onSuccessCallback?.();
    },
  });
}
