"use client";

import { MerchantUser, MerchantUsersFilters, MerchantUsersResult } from "@/types/User";
import axiosConfig from "@/utils/axiosConfig";
import { USERS_API } from "@/utils/endpoints";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const axiosClient = axiosConfig();

export function useMerchantUsers(filters?: MerchantUsersFilters) {
  return useQuery<MerchantUsersResult>({
    queryKey: ["merchant-users", filters],
    queryFn: async () => {
      const res = await axiosClient.get(`${USERS_API}/merchants`, {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          skip: filters?.skip,
          take: filters?.take,
        },
      });

      return res.data as MerchantUsersResult;
    },
  });
}

export function useInfiniteMerchantUsers(limit: number = 20) {
  return useInfiniteQuery<MerchantUsersResult>({
    queryKey: ["merchant-users", "infinite", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get(`${USERS_API}/merchants`, {
        params: { page: pageParam, limit },
      });

      return res.data as MerchantUsersResult;
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
