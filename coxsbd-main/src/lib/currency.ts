// lib/currency.ts
export const formatCurrency = (amount: number, currency: string = "BDT") => {
try {
return new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(amount);
} catch {
// Fallback if currency not supported
return `${amount.toFixed(2)} ${currency}`;
}
};