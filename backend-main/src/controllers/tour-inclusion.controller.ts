import { Request, Response } from "express";
import { TourInclusionService } from "../services/tour-inclusion.service";
import { Prisma } from "@prisma/client";

const tourInclusionService = new TourInclusionService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This tour inclusion already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tour inclusion not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for tour inclusion." });
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

export const createTourInclusion = async (req: Request, res: Response) => {
  try {
    const tourInclusion = await tourInclusionService.createTourInclusion(req.body);
    res.status(201).json(tourInclusion);
  } catch (err: any) {
    logError("CREATE_TOUR_INCLUSION", err, res);
  }
};

export const getTourInclusions = async (req: Request, res: Response) => {
  try {
    const { name, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (name) {
      filter.name = { contains: name as string };
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

    const result = await tourInclusionService.getTourInclusions(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_TOUR_INCLUSIONS", err, res);
  }
};

export const getTourInclusionById = async (req: Request, res: Response) => {
  try {
    const tourInclusion = await tourInclusionService.getTourInclusionById(req.params.id);
    if (!tourInclusion) return res.status(404).json({ error: "Tour inclusion not found" });
    res.json(tourInclusion);
  } catch (err: any) {
    logError("GET_TOUR_INCLUSION_BY_ID", err, res);
  }
};

export const getTourInclusionByName = async (req: Request, res: Response) => {
  try {
    const tourInclusion = await tourInclusionService.getTourInclusionByName(req.params.name);
    if (!tourInclusion) return res.status(404).json({ error: "Tour inclusion not found" });
    res.json(tourInclusion);
  } catch (err: any) {
    logError("GET_TOUR_INCLUSION_BY_NAME", err, res);
  }
};

export const updateTourInclusion = async (req: Request, res: Response) => {
  try {
    const tourInclusion = await tourInclusionService.updateTourInclusion(req.params.id, req.body);
    res.json(tourInclusion);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour inclusion not found for update." });
    }
    logError("UPDATE_TOUR_INCLUSION", err, res);
  }
};

export const deleteTourInclusion = async (req: Request, res: Response) => {
  try {
    await tourInclusionService.deleteTourInclusion(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour inclusion not found for delete." });
    }
    logError("DELETE_TOUR_INCLUSION", err, res);
  }
};

export const getAllTourInclusions = async (req: Request, res: Response) => {
  try {
    const tourInclusions = await tourInclusionService.getAllTourInclusions();
    res.json(tourInclusions);
  } catch (err: any) {
    logError("GET_ALL_TOUR_INCLUSIONS", err, res);
  }
};

