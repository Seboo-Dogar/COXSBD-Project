import { Request, Response } from "express";
import { TourExclusionService } from "../services/tour-exclusion.service";
import { Prisma } from "@prisma/client";

const tourExclusionService = new TourExclusionService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This tour exclusion already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tour exclusion not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for tour exclusion." });
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

export const createTourExclusion = async (req: Request, res: Response) => {
  try {
    const tourExclusion = await tourExclusionService.createTourExclusion(req.body);
    res.status(201).json(tourExclusion);
  } catch (err: any) {
    logError("CREATE_TOUR_EXCLUSION", err, res);
  }
};

export const getTourExclusions = async (req: Request, res: Response) => {
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

    const result = await tourExclusionService.getTourExclusions(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_TOUR_EXCLUSIONS", err, res);
  }
};

export const getTourExclusionById = async (req: Request, res: Response) => {
  try {
    const tourExclusion = await tourExclusionService.getTourExclusionById(req.params.id);
    if (!tourExclusion) return res.status(404).json({ error: "Tour exclusion not found" });
    res.json(tourExclusion);
  } catch (err: any) {
    logError("GET_TOUR_EXCLUSION_BY_ID", err, res);
  }
};

export const getTourExclusionByName = async (req: Request, res: Response) => {
  try {
    const tourExclusion = await tourExclusionService.getTourExclusionByName(req.params.name);
    if (!tourExclusion) return res.status(404).json({ error: "Tour exclusion not found" });
    res.json(tourExclusion);
  } catch (err: any) {
    logError("GET_TOUR_EXCLUSION_BY_NAME", err, res);
  }
};

export const updateTourExclusion = async (req: Request, res: Response) => {
  try {
    const tourExclusion = await tourExclusionService.updateTourExclusion(req.params.id, req.body);
    res.json(tourExclusion);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour exclusion not found for update." });
    }
    logError("UPDATE_TOUR_EXCLUSION", err, res);
  }
};

export const deleteTourExclusion = async (req: Request, res: Response) => {
  try {
    await tourExclusionService.deleteTourExclusion(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour exclusion not found for delete." });
    }
    logError("DELETE_TOUR_EXCLUSION", err, res);
  }
};

export const getAllTourExclusions = async (req: Request, res: Response) => {
  try {
    const tourExclusions = await tourExclusionService.getAllTourExclusions();
    res.json(tourExclusions);
  } catch (err: any) {
    logError("GET_ALL_TOUR_EXCLUSIONS", err, res);
  }
};

