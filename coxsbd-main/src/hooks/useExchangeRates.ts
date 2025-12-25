"use client";

import { useEffect, useState } from "react";

export default function useExchangeRates() {
  const [rates, setRates] = useState<{ [key: string]: number } | null>(null);

  useEffect(() => {
    fetch("/rates")
      .then((res) => res.json())
      .then((data) => setRates(data.rates))
      .catch((err) => console.error(err));
  }, []);

  return rates;
}
