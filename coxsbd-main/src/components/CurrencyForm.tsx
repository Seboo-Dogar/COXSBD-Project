"use client";

import { useState } from "react";

interface Props {
  onAdd: () => void;
}

export default function CurrencyForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [rate, setRate] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    await fetch("/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, rate }),
    });

    setName("");
    setCode("");
    setRate(1);
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Currency Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 w-full rounded"
      />
      <input
        type="text"
        placeholder="Currency Code (e.g. USD)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border px-2 py-1 w-full rounded"
      />
      <input
        type="number"
        placeholder="Rate"
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="border px-2 py-1 w-full rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Add Currency
      </button>
    </form>
  );
}
