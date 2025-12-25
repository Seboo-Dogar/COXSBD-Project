import { Request, Response } from "express";
import { AirportService } from "../services/airport.service";
import { Prisma } from "@prisma/client";

const airportService = new AirportService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This airport already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Airport not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for airport." });
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

export const createAirport = async (req: Request, res: Response) => {
  try {
    const airport = await airportService.createAirport(req.body);
    res.status(201).json(airport);
  } catch (err: any) {
    logError("CREATE_AIRPORT", err, res);
  }
};

export const getAirports = async (req: Request, res: Response) => {
  try {
    const { status, country, city, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (country) {
      filter.country = { contains: country as string };
    }

    if (city) {
      filter.city = { contains: city as string };
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

    const result = await airportService.getAirports(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_AIRPORTS", err, res);
  }
};

export const getAirportById = async (req: Request, res: Response) => {
  try {
    const airport = await airportService.getAirportById(req.params.id);
    if (!airport) return res.status(404).json({ error: "Airport not found" });
    res.json(airport);
  } catch (err: any) {
    logError("GET_AIRPORT_BY_ID", err, res);
  }
};

export const getAirportByCode = async (req: Request, res: Response) => {
  try {
    const airport = await airportService.getAirportByCode(req.params.code);
    if (!airport) return res.status(404).json({ error: "Airport not found" });
    res.json(airport);
  } catch (err: any) {
    logError("GET_AIRPORT_BY_CODE", err, res);
  }
};

export const updateAirport = async (req: Request, res: Response) => {
  try {
    const airport = await airportService.updateAirport(req.params.id, req.body);
    res.json(airport);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Airport not found for update." });
    }
    logError("UPDATE_AIRPORT", err, res);
  }
};

export const deleteAirport = async (req: Request, res: Response) => {
  try {
    await airportService.deleteAirport(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Airport not found for delete." });
    }
    logError("DELETE_AIRPORT", err, res);
  }
};

export const getActiveAirports = async (req: Request, res: Response) => {
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

    const result = await airportService.getActiveAirports(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_AIRPORTS", err, res);
  }
};

