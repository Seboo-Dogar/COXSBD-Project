import { Request, Response } from "express";
import { AppStoresLinksService } from "../services/app-stores-links.service";
import { Prisma } from "@prisma/client";

const appStoresLinksService = new AppStoresLinksService();

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
      return res.status(404).json({ error: "App stores links not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for app stores links." });
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

export const createAppStoresLinks = async (req: Request, res: Response) => {
  try {
    const settings = await appStoresLinksService.createAppStoresLinks(req.body);
    res.status(201).json(settings);
  } catch (err: any) {
    logError("CREATE_APP_STORES_LINKS", err, res);
  }
};

export const getAppStoresLinks = async (req: Request, res: Response) => {
  try {
    const settings = await appStoresLinksService.getAppStoresLinks();
    if (!settings) return res.status(404).json({ error: "App stores links not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_APP_STORES_LINKS", err, res);
  }
};

export const getAppStoresLinksById = async (req: Request, res: Response) => {
  try {
    const settings = await appStoresLinksService.getAppStoresLinksById(req.params.id);
    if (!settings) return res.status(404).json({ error: "App stores links not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_APP_STORES_LINKS_BY_ID", err, res);
  }
};

export const updateAppStoresLinks = async (req: Request, res: Response) => {
  try {
    const settings = await appStoresLinksService.updateAppStoresLinks(req.params.id, req.body);
    res.json(settings);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "App stores links not found for update." });
    }
    logError("UPDATE_APP_STORES_LINKS", err, res);
  }
};

export const deleteAppStoresLinks = async (req: Request, res: Response) => {
  try {
    await appStoresLinksService.deleteAppStoresLinks(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "App stores links not found for delete." });
    }
    logError("DELETE_APP_STORES_LINKS", err, res);
  }
};

