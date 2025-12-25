"use client";

import { useEffect, useState } from "react";

interface Currency {
  id: number;
  name: string;
  code: string;
  rate: number;
}

export default function CurrencyList() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const fetchCurrencies = async () => {
    const res = await fetch("/currency");
    const data = await res.json();
    setCurrencies(data);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Available Currencies</h2>
      <ul className="space-y-2">
        {currencies.map((cur) => (
          <li
            key={cur.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-bold">{cur.code}</span> - {cur.name}
            </div>
            <div className="text-sm text-gray-600">Rate: {cur.rate}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
