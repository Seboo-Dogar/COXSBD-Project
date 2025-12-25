import { Request, Response } from "express";
import { BrandingService } from "../services/branding.service";
import { Prisma } from "@prisma/client";

const brandingService = new BrandingService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This setting already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Branding not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for branding." });
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

export const createBranding = async (req: Request, res: Response) => {
  try {
    const branding = await brandingService.createBranding(req.body);
    res.status(201).json(branding);
  } catch (err: any) {
    logError("CREATE_BRANDING", err, res);
  }
};

export const getBranding = async (req: Request, res: Response) => {
  try {
    const branding = await brandingService.getBranding();
    if (!branding) return res.status(404).json({ error: "Branding not found" });
    res.json(branding);
  } catch (err: any) {
    logError("GET_BRANDING", err, res);
  }
};

export const getBrandingById = async (req: Request, res: Response) => {
  try {
    const branding = await brandingService.getBrandingById(req.params.id);
    if (!branding) return res.status(404).json({ error: "Branding not found" });
    res.json(branding);
  } catch (err: any) {
    logError("GET_BRANDING_BY_ID", err, res);
  }
};

export const updateBranding = async (req: Request, res: Response) => {
  try {
    const branding = await brandingService.updateBranding(req.params.id, req.body);
    res.json(branding);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Branding not found for update." });
    }
    logError("UPDATE_BRANDING", err, res);
  }
};

export const deleteBranding = async (req: Request, res: Response) => {
  try {
    await brandingService.deleteBranding(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Branding not found for delete." });
    }
    logError("DELETE_BRANDING", err, res);
  }
};

