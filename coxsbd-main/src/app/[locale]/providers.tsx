"use client";

import { CartProvider } from "@/context/cartContext";
import { CurrencyProvider } from "@/context/currencyContext";
import { queryClient } from "@/utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CurrencyProvider>
          <Suspense>{children}</Suspense>
        </CurrencyProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
