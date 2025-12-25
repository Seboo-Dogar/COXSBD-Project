import { Request, Response } from "express";
import { AirlineService } from "../services/airline.service";
import { Prisma } from "@prisma/client";

const airlineService = new AirlineService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This airline already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Airline not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for airline." });
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

export const createAirline = async (req: Request, res: Response) => {
  try {
    const airline = await airlineService.createAirline(req.body);
    res.status(201).json(airline);
  } catch (err: any) {
    logError("CREATE_AIRLINE", err, res);
  }
};

export const getAirlines = async (req: Request, res: Response) => {
  try {
    const { status, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
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

    const result = await airlineService.getAirlines(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_AIRLINES", err, res);
  }
};

export const getAirlineById = async (req: Request, res: Response) => {
  try {
    const airline = await airlineService.getAirlineById(req.params.id);
    if (!airline) return res.status(404).json({ error: "Airline not found" });
    res.json(airline);
  } catch (err: any) {
    logError("GET_AIRLINE_BY_ID", err, res);
  }
};

export const updateAirline = async (req: Request, res: Response) => {
  try {
    const airline = await airlineService.updateAirline(req.params.id, req.body);
    res.json(airline);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Airline not found for update." });
    }
    logError("UPDATE_AIRLINE", err, res);
  }
};

export const deleteAirline = async (req: Request, res: Response) => {
  try {
    await airlineService.deleteAirline(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Airline not found for delete." });
    }
    logError("DELETE_AIRLINE", err, res);
  }
};

export const getActiveAirlines = async (req: Request, res: Response) => {
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

    const result = await airlineService.getActiveAirlines(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_AIRLINES", err, res);
  }
};

