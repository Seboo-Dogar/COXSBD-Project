"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Currency {
  code: string;
  name: string;
  rateToUSD: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currency, setCurrency] = useState<Currency>({
    code: "USD",
    name: "US Dollar",
    rateToUSD: 1,
  });

  // Fetch currencies from backend on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("/currency");
        const data: Currency[] = await res.json();
        setCurrencies(data);
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
        // Fallback to default currencies
        setCurrencies([
          { code: "USD", name: "US Dollar", rateToUSD: 1 },
          { code: "BDT", name: "Bangladeshi Taka", rateToUSD: 0.012 },
          { code: "INR", name: "Indian Rupee", rateToUSD: 0.012 },
          { code: "CNY", name: "Chinese Yuan", rateToUSD: 0.14 },
        ]);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
