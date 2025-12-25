"use client";

import { useEffect, useState } from "react";

interface Currency {
  id: number;
  code: string;
  rate: number;
}

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const fetchCurrencies = async () => {
    const res = await fetch("/currency");
    const data = await res.json();
    setCurrencies(data);
    if (data.length > 1) {
      setFrom(data[0].code);
      setTo(data[1].code);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const convert = () => {
    const fromCur = currencies.find((c) => c.code === from);
    const toCur = currencies.find((c) => c.code === to);

    if (!fromCur || !toCur) return;
    const converted = (amount / fromCur.rate) * toCur.rate;
    setResult(converted);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Currency Converter</h2>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="border px-2 py-1 rounded"
        />
        <div className="flex gap-2">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {currencies.map((cur) => (
              <option key={cur.id} value={cur.code}>
                {cur.code}
              </option>
            ))}
          </select>
          <span className="self-center">→</span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {currencies.map((cur) => (
              <option key={cur.id} value={cur.code}>
                {cur.code}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={convert}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Convert
        </button>
        {result !== null && (
          <div className="mt-2 text-blue-600 font-bold">
            {amount} {from} = {result.toFixed(2)} {to}
          </div>
        )}
      </div>
    </div>
  );
}
