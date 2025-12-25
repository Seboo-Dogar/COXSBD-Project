import { useCurrency } from "@/context/currencyContext";

export default function ProductPrice({ priceUSD }: { priceUSD: number }) {
  const { currency } = useCurrency();

  const convertedPrice = priceUSD * currency.rateToUSD; // Convert USD to selected currency

  return (
    <span>
      {convertedPrice.toFixed(2)} {currency.code}
    </span>
  );
}
