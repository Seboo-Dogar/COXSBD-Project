import { Request, Response } from "express";
import { LanguageCurrenciesService } from "../services/language-currencies.service";
import { Prisma } from "@prisma/client";

const languageCurrenciesService = new LanguageCurrenciesService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This setting already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Language currencies not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for language currencies." });
  }

  // Check if it's a validation error
  if (err.name === 'ValidationError') {
    console.error(`[ERROR] ${endpoint} Validation Error:`, err.message);
    return res.status(400).json({ error: err.message });
  }

  // Log general server errors
  console.error(`[FATAL ERROR] ${endpoint} Unhandled Error:`, err);
  console.error(`Request Body:`, res.req.body);
  res.status(500).json({ error: "An unexpected server error occurred." });
};

export const createLanguageCurrencies = async (req: Request, res: Response) => {
  try {
    const settings = await languageCurrenciesService.createLanguageCurrencies(req.body);
    res.status(201).json(settings);
  } catch (err: any) {
    logError("CREATE_LANGUAGE_CURRENCIES", err, res);
  }
};

export const getLanguageCurrencies = async (req: Request, res: Response) => {
  try {
    const settings = await languageCurrenciesService.getLanguageCurrencies();
    if (!settings) return res.status(404).json({ error: "Language currencies not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_LANGUAGE_CURRENCIES", err, res);
  }
};

export const getLanguageCurrenciesById = async (req: Request, res: Response) => {
  try {
    const settings = await languageCurrenciesService.getLanguageCurrenciesById(req.params.id);
    if (!settings) return res.status(404).json({ error: "Language currencies not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_LANGUAGE_CURRENCIES_BY_ID", err, res);
  }
};

export const updateLanguageCurrencies = async (req: Request, res: Response) => {
  try {
    const settings = await languageCurrenciesService.updateLanguageCurrencies(req.params.id, req.body);
    res.json(settings);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Language currencies not found for update." });
    }
    logError("UPDATE_LANGUAGE_CURRENCIES", err, res);
  }
};

export const deleteLanguageCurrencies = async (req: Request, res: Response) => {
  try {
    await languageCurrenciesService.deleteLanguageCurrencies(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Language currencies not found for delete." });
    }
    logError("DELETE_LANGUAGE_CURRENCIES", err, res);
  }
};

