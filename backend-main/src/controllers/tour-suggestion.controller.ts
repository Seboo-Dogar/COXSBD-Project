import { Request, Response } from "express";
import { TourSuggestionService } from "../services/tour-suggestion.service";
import { Prisma } from "@prisma/client";

const tourSuggestionService = new TourSuggestionService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This tour suggestion already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tour suggestion not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for tour suggestion." });
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

export const createTourSuggestion = async (req: Request, res: Response) => {
  try {
    const tourSuggestion = await tourSuggestionService.createTourSuggestion(req.body);
    res.status(201).json(tourSuggestion);
  } catch (err: any) {
    logError("CREATE_TOUR_SUGGESTION", err, res);
  }
};

export const getTourSuggestions = async (req: Request, res: Response) => {
  try {
    const { status, city, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
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

    const result = await tourSuggestionService.getTourSuggestions(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_TOUR_SUGGESTIONS", err, res);
  }
};

export const getTourSuggestionById = async (req: Request, res: Response) => {
  try {
    const tourSuggestion = await tourSuggestionService.getTourSuggestionById(req.params.id);
    if (!tourSuggestion) return res.status(404).json({ error: "Tour suggestion not found" });
    res.json(tourSuggestion);
  } catch (err: any) {
    logError("GET_TOUR_SUGGESTION_BY_ID", err, res);
  }
};

export const updateTourSuggestion = async (req: Request, res: Response) => {
  try {
    const tourSuggestion = await tourSuggestionService.updateTourSuggestion(req.params.id, req.body);
    res.json(tourSuggestion);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour suggestion not found for update." });
    }
    logError("UPDATE_TOUR_SUGGESTION", err, res);
  }
};

export const deleteTourSuggestion = async (req: Request, res: Response) => {
  try {
    await tourSuggestionService.deleteTourSuggestion(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour suggestion not found for delete." });
    }
    logError("DELETE_TOUR_SUGGESTION", err, res);
  }
};

export const getActiveTourSuggestions = async (req: Request, res: Response) => {
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

    const result = await tourSuggestionService.getActiveTourSuggestions(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_TOUR_SUGGESTIONS", err, res);
  }
};

