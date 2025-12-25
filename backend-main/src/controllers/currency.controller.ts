import { Request, Response } from "express";
import * as service from "../services/currency.service";

export const createCurrency = async (req: Request, res: Response) => {
  const { code, name, rate } = req.body;
  const currency = await service.createCurrency(code, name, rate);
  res.json(currency);
};

export const getCurrencies = async (_req: Request, res: Response) => {
  const currencies = await service.getCurrencies();
  res.json(currencies);
};

export const updateCurrency = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rate } = req.body;
  const currency = await service.updateCurrency(Number(id), rate);
  res.json(currency);
};

export const deleteCurrency = async (req: Request, res: Response) => {
  const { id } = req.params;
  await service.deleteCurrency(Number(id));
  res.json({ message: "Deleted successfully" });
};

export const convertCurrency = async (req: Request, res: Response) => {
  const { amount, from, to } = req.body;
  const result = await service.convertCurrency(amount, from, to);
  res.json({ result });
};
