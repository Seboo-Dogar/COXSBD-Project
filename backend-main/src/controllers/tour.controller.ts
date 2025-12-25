import { Request, Response } from "express";
import { TourService } from "../services/tour.service";
import { Prisma } from "@prisma/client";

const tourService = new TourService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This tour already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Tour not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for tour." });
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

export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.createTour(req.body);
    res.status(201).json(tour);
  } catch (err: any) {
    logError("CREATE_TOUR", err, res);
  }
};

export const getTours = async (req: Request, res: Response) => {
  try {
    const { status, featured, offer, tourTypeId, userId, location, minRating, maxRating, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (offer !== undefined) {
      filter.offer = offer === 'true';
    }

    if (tourTypeId) {
      filter.tourTypeId = tourTypeId as string;
    }

    if (userId) {
      filter.userId = userId as string;
    }

    if (location) {
      filter.location = { contains: location as string };
    }

    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined) {
        filter.rating.gte = parseFloat(minRating as string);
      }
      if (maxRating !== undefined) {
        filter.rating.lte = parseFloat(maxRating as string);
      }
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

    const result = await tourService.getTours(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_TOURS", err, res);
  }
};

export const getTourById = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    res.json(tour);
  } catch (err: any) {
    logError("GET_TOUR_BY_ID", err, res);
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);
    res.json(tour);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour not found for update." });
    }
    logError("UPDATE_TOUR", err, res);
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await tourService.deleteTour(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Tour not found for delete." });
    }
    logError("DELETE_TOUR", err, res);
  }
};

export const getActiveTours = async (req: Request, res: Response) => {
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

    const result = await tourService.getActiveTours(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_ACTIVE_TOURS", err, res);
  }
};

export const getFeaturedTours = async (req: Request, res: Response) => {
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

    const result = await tourService.getFeaturedTours(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_FEATURED_TOURS", err, res);
  }
};

export const getToursWithOffers = async (req: Request, res: Response) => {
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

    const result = await tourService.getToursWithOffers(skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_TOURS_WITH_OFFERS", err, res);
  }
};

