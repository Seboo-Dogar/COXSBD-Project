import { Request, Response } from "express";
import { VisaToCountryService } from "../services/visa-to-country.service";
import { Prisma } from "@prisma/client";

const visaToCountryService = new VisaToCountryService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This visa to country already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Visa to country not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for visa to country." });
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

export const createVisaToCountry = async (req: Request, res: Response) => {
  try {
    const visaToCountry = await visaToCountryService.createVisaToCountry(req.body);
    res.status(201).json(visaToCountry);
  } catch (err: any) {
    logError("CREATE_VISA_TO_COUNTRY", err, res);
  }
};

export const getVisaToCountries = async (req: Request, res: Response) => {
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

    const result = await visaToCountryService.getVisaToCountries(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_VISA_TO_COUNTRIES", err, res);
  }
};

export const getVisaToCountryById = async (req: Request, res: Response) => {
  try {
    const visaToCountry = await visaToCountryService.getVisaToCountryById(req.params.id);
    if (!visaToCountry) return res.status(404).json({ error: "Visa to country not found" });
    res.json(visaToCountry);
  } catch (err: any) {
    logError("GET_VISA_TO_COUNTRY_BY_ID", err, res);
  }
};

export const getVisaToCountryByIso = async (req: Request, res: Response) => {
  try {
    const visaToCountry = await visaToCountryService.getVisaToCountryByIso(req.params.iso);
    if (!visaToCountry) return res.status(404).json({ error: "Visa to country not found" });
    res.json(visaToCountry);
  } catch (err: any) {
    logError("GET_VISA_TO_COUNTRY_BY_ISO", err, res);
  }
};

export const updateVisaToCountry = async (req: Request, res: Response) => {
  try {
    const visaToCountry = await visaToCountryService.updateVisaToCountry(req.params.id, req.body);
    res.json(visaToCountry);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa to country not found for update." });
    }
    logError("UPDATE_VISA_TO_COUNTRY", err, res);
  }
};

export const deleteVisaToCountry = async (req: Request, res: Response) => {
  try {
    await visaToCountryService.deleteVisaToCountry(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa to country not found for delete." });
    }
    logError("DELETE_VISA_TO_COUNTRY", err, res);
  }
};

export const getActiveVisaToCountries = async (req: Request, res: Response) => {
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

    const result = await visaToCountryService.getActiveVisaToCountries(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_VISA_TO_COUNTRIES", err, res);
  }
};

export const getAllVisaToCountries = async (req: Request, res: Response) => {
  try {
    const visaToCountries = await visaToCountryService.getAllVisaToCountries();
    res.json(visaToCountries);
  } catch (err: any) {
    logError("GET_ALL_VISA_TO_COUNTRIES", err, res);
  }
};

