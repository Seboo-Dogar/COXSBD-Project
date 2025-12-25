import { Request, Response } from "express";
import { FlightSuggestionService } from "../services/flight-suggestion.service";
import { Prisma } from "@prisma/client";

const flightSuggestionService = new FlightSuggestionService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This flight suggestion already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Flight suggestion not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for flight suggestion." });
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

export const createFlightSuggestion = async (req: Request, res: Response) => {
  try {
    const flightSuggestion = await flightSuggestionService.createFlightSuggestion(req.body);
    res.status(201).json(flightSuggestion);
  } catch (err: any) {
    logError("CREATE_FLIGHT_SUGGESTION", err, res);
  }
};

export const getFlightSuggestions = async (req: Request, res: Response) => {
  try {
    const { status, type, cityAirport, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (type) {
      filter.type = type as string;
    }

    if (cityAirport) {
      filter.cityAirport = { contains: cityAirport as string };
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

    const result = await flightSuggestionService.getFlightSuggestions(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_FLIGHT_SUGGESTIONS", err, res);
  }
};

export const getFlightSuggestionById = async (req: Request, res: Response) => {
  try {
    const flightSuggestion = await flightSuggestionService.getFlightSuggestionById(req.params.id);
    if (!flightSuggestion) return res.status(404).json({ error: "Flight suggestion not found" });
    res.json(flightSuggestion);
  } catch (err: any) {
    logError("GET_FLIGHT_SUGGESTION_BY_ID", err, res);
  }
};

export const updateFlightSuggestion = async (req: Request, res: Response) => {
  try {
    const flightSuggestion = await flightSuggestionService.updateFlightSuggestion(req.params.id, req.body);
    res.json(flightSuggestion);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Flight suggestion not found for update." });
    }
    logError("UPDATE_FLIGHT_SUGGESTION", err, res);
  }
};

export const deleteFlightSuggestion = async (req: Request, res: Response) => {
  try {
    await flightSuggestionService.deleteFlightSuggestion(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Flight suggestion not found for delete." });
    }
    logError("DELETE_FLIGHT_SUGGESTION", err, res);
  }
};

export const getActiveFlightSuggestions = async (req: Request, res: Response) => {
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

    const result = await flightSuggestionService.getActiveFlightSuggestions(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_FLIGHT_SUGGESTIONS", err, res);
  }
};

