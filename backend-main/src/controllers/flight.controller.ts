import { Request, Response } from "express";
import { FlightService } from "../services/flight.service";
import { Prisma } from "@prisma/client";

const flightService = new FlightService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This flight already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Flight not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for flight." });
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

export const createFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.createFlight(req.body);
    res.status(201).json(flight);
  } catch (err: any) {
    logError("CREATE_FLIGHT", err, res);
  }
};

export const getFlights = async (req: Request, res: Response) => {
  try {
    const { status, userId, airlineId, fromAirportId, toAirportId, type, offer, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (userId) {
      filter.userId = userId as string;
    }

    if (airlineId) {
      filter.airlineId = airlineId as string;
    }

    if (fromAirportId) {
      filter.fromAirportId = fromAirportId as string;
    }

    if (toAirportId) {
      filter.toAirportId = toAirportId as string;
    }

    if (type) {
      filter.type = type as string;
    }

    if (offer !== undefined) {
      filter.offer = offer === 'true';
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

    const result = await flightService.getFlights(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_FLIGHTS", err, res);
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.json(flight);
  } catch (err: any) {
    logError("GET_FLIGHT_BY_ID", err, res);
  }
};

export const updateFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.updateFlight(req.params.id, req.body);
    res.json(flight);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Flight not found for update." });
    }
    logError("UPDATE_FLIGHT", err, res);
  }
};

export const deleteFlight = async (req: Request, res: Response) => {
  try {
    await flightService.deleteFlight(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Flight not found for delete." });
    }
    logError("DELETE_FLIGHT", err, res);
  }
};

export const getActiveFlights = async (req: Request, res: Response) => {
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

    const result = await flightService.getActiveFlights(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_FLIGHTS", err, res);
  }
};

export const getFlightsWithOffers = async (req: Request, res: Response) => {
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

    const result = await flightService.getFlightsWithOffers(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_FLIGHTS_WITH_OFFERS", err, res);
  }
};

