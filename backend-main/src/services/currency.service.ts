import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCurrency = async (code: string, name: string, rateToUSD: number) => {
  return prisma.currency.create({ data: { code, name, rateToUSD } });
};

export const getCurrencies = async () => {
  return prisma.currency.findMany();
};

export const updateCurrency = async (id: number, rateToUSD: number) => {
  return prisma.currency.update({ where: { id }, data: { rateToUSD } });
};

export const deleteCurrency = async (id: number) => {
  return prisma.currency.delete({ where: { id } });
};

export const convertCurrency = async (from: string, to: string, amount: number) => {
  const fromCurrency = await prisma.currency.findUnique({ where: { code: from } });
  const toCurrency = await prisma.currency.findUnique({ where: { code: to } });

  if (!fromCurrency || !toCurrency) {
    throw new Error("Currency not found");
  }

  // Convert using rateToUSD as the base
  const usdAmount = amount / fromCurrency.rateToUSD;
  return usdAmount * toCurrency.rateToUSD;
};
