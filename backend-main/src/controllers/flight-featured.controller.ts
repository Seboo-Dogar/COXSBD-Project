import { Request, Response } from "express";
import { FlightFeaturedService } from "../services/flight-featured.service";
import { Prisma } from "@prisma/client";

const flightFeaturedService = new FlightFeaturedService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This featured flight already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Featured flight not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for featured flight." });
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

export const createFlightFeatured = async (req: Request, res: Response) => {
  try {
    const flightFeatured = await flightFeaturedService.createFlightFeatured(req.body);
    res.status(201).json(flightFeatured);
  } catch (err: any) {
    logError("CREATE_FLIGHT_FEATURED", err, res);
  }
};

export const getFlightFeatureds = async (req: Request, res: Response) => {
  try {
    const { status, airlineId, fromAirportId, toAirportId, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
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

    const result = await flightFeaturedService.getFlightFeatureds(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_FLIGHT_FEATUREDS", err, res);
  }
};

export const getFlightFeaturedById = async (req: Request, res: Response) => {
  try {
    const flightFeatured = await flightFeaturedService.getFlightFeaturedById(req.params.id);
    if (!flightFeatured) return res.status(404).json({ error: "Featured flight not found" });
    res.json(flightFeatured);
  } catch (err: any) {
    logError("GET_FLIGHT_FEATURED_BY_ID", err, res);
  }
};

export const updateFlightFeatured = async (req: Request, res: Response) => {
  try {
    const flightFeatured = await flightFeaturedService.updateFlightFeatured(req.params.id, req.body);
    res.json(flightFeatured);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Featured flight not found for update." });
    }
    logError("UPDATE_FLIGHT_FEATURED", err, res);
  }
};

export const deleteFlightFeatured = async (req: Request, res: Response) => {
  try {
    await flightFeaturedService.deleteFlightFeatured(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Featured flight not found for delete." });
    }
    logError("DELETE_FLIGHT_FEATURED", err, res);
  }
};

export const getActiveFlightFeatureds = async (req: Request, res: Response) => {
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

    const result = await flightFeaturedService.getActiveFlightFeatureds(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_FLIGHT_FEATUREDS", err, res);
  }
};

