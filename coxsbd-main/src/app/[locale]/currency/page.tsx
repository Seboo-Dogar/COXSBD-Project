"use client";
import CurrencyConverter from "@/components/CurrencyConverter";
import CurrencyForm from "@/components/CurrencyForm";
import CurrencyList from "@/components/CurrencyList";
import { useState } from "react";

export default function Page() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Currency Manager</h1>
      <CurrencyForm onAdd={() => setRefresh(prev => !prev)} />
      <CurrencyList key={refresh ? "r1" : "r2"} />
      <CurrencyConverter />
    </div>
  );
}
