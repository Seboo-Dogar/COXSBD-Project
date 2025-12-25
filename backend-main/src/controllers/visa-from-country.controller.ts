import { Request, Response } from "express";
import { VisaFromCountryService } from "../services/visa-from-country.service";
import { Prisma } from "@prisma/client";

const visaFromCountryService = new VisaFromCountryService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This visa from country already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Visa from country not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for visa from country." });
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

export const createVisaFromCountry = async (req: Request, res: Response) => {
  try {
    const visaFromCountry = await visaFromCountryService.createVisaFromCountry(req.body);
    res.status(201).json(visaFromCountry);
  } catch (err: any) {
    logError("CREATE_VISA_FROM_COUNTRY", err, res);
  }
};

export const getVisaFromCountries = async (req: Request, res: Response) => {
  try {
    const { status, country, nicename, iso, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (country) {
      filter.country = { contains: country as string };
    }

    if (nicename) {
      filter.nicename = { contains: nicename as string };
    }

    if (iso) {
      filter.iso = iso as string;
    }

    // Support both page/limit and skip/take patterns
    let skipValue = 0;
    let takeValue = 10;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      skipValue = (pageNum - 1) * limitNum;
      takeValue = limitNum;
    } else if (skip !== undefined || take !== undefined) {
      skipValue = Math.max(0, parseInt(skip as string) || 0);
      takeValue = Math.max(1, parseInt(take as string) || 10);
    }

    const result = await visaFromCountryService.getVisaFromCountries(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_VISA_FROM_COUNTRIES", err, res);
  }
};

export const getVisaFromCountryById = async (req: Request, res: Response) => {
  try {
    const visaFromCountry = await visaFromCountryService.getVisaFromCountryById(req.params.id);
    if (!visaFromCountry) return res.status(404).json({ error: "Visa from country not found" });
    res.json(visaFromCountry);
  } catch (err: any) {
    logError("GET_VISA_FROM_COUNTRY_BY_ID", err, res);
  }
};

export const getVisaFromCountryByIso = async (req: Request, res: Response) => {
  try {
    const visaFromCountry = await visaFromCountryService.getVisaFromCountryByIso(req.params.iso);
    if (!visaFromCountry) return res.status(404).json({ error: "Visa from country not found" });
    res.json(visaFromCountry);
  } catch (err: any) {
    logError("GET_VISA_FROM_COUNTRY_BY_ISO", err, res);
  }
};

export const updateVisaFromCountry = async (req: Request, res: Response) => {
  try {
    const visaFromCountry = await visaFromCountryService.updateVisaFromCountry(req.params.id, req.body);
    res.json(visaFromCountry);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa from country not found for update." });
    }
    logError("UPDATE_VISA_FROM_COUNTRY", err, res);
  }
};

export const deleteVisaFromCountry = async (req: Request, res: Response) => {
  try {
    await visaFromCountryService.deleteVisaFromCountry(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa from country not found for delete." });
    }
    logError("DELETE_VISA_FROM_COUNTRY", err, res);
  }
};

export const getActiveVisaFromCountries = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip, take } = req.query;

    // Support both page/limit and skip/take patterns
    let skipValue = 0;
    let takeValue = 10;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      skipValue = (pageNum - 1) * limitNum;
      takeValue = limitNum;
    } else if (skip !== undefined || take !== undefined) {
      skipValue = Math.max(0, parseInt(skip as string) || 0);
      takeValue = Math.max(1, parseInt(take as string) || 10);
    }

    const result = await visaFromCountryService.getActiveVisaFromCountries(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_VISA_FROM_COUNTRIES", err, res);
  }
};

export const getAllVisaFromCountries = async (req: Request, res: Response) => {
  try {
    const visaFromCountries = await visaFromCountryService.getAllVisaFromCountries();
    res.json(visaFromCountries);
  } catch (err: any) {
    logError("GET_ALL_VISA_FROM_COUNTRIES", err, res);
  }
};

