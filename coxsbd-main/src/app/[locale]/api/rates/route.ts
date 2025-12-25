import { NextResponse } from "next/server";

// export const revalidate = 60 * 60 * 12; // revalidate every 12h

export const revalidate = 43200;

const SUPPORTED = ["USD", "BDT", "INR", "CNY", "EUR"]; // add/remove as needed
const BASE = "USD";

export async function GET() {
  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=${BASE}`,
      { next: { revalidate } }
    );
    if (!res.ok) throw new Error("Rates API failed");
    const data = await res.json();
    // Keep only supported currencies (and base=1)
    const rates: Record<string, number> = { [BASE]: 1 };
    SUPPORTED.forEach((c) => {
      if (c === BASE) return;
      rates[c] = data?.rates?.[c] ?? null;
    });
    return NextResponse.json({ base: BASE, rates, updatedAt: Date.now() });
  } catch (e) {
    return NextResponse.json(
      { error: "Unable to load rates" },
      { status: 500 }
    );
  }
}
