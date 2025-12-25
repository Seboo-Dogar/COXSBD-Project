import { Request, Response } from "express";
import { SocialLinksService } from "../services/social-links.service";
import { Prisma } from "@prisma/client";

const socialLinksService = new SocialLinksService();

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
      return res.status(404).json({ error: "Social links not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for social links." });
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

export const createSocialLinks = async (req: Request, res: Response) => {
  try {
    const socialLinks = await socialLinksService.createSocialLinks(req.body);
    res.status(201).json(socialLinks);
  } catch (err: any) {
    logError("CREATE_SOCIAL_LINKS", err, res);
  }
};

export const getSocialLinks = async (req: Request, res: Response) => {
  try {
    const socialLinks = await socialLinksService.getSocialLinks();
    if (!socialLinks) return res.status(404).json({ error: "Social links not found" });
    res.json(socialLinks);
  } catch (err: any) {
    logError("GET_SOCIAL_LINKS", err, res);
  }
};

export const getSocialLinksById = async (req: Request, res: Response) => {
  try {
    const socialLinks = await socialLinksService.getSocialLinksById(req.params.id);
    if (!socialLinks) return res.status(404).json({ error: "Social links not found" });
    res.json(socialLinks);
  } catch (err: any) {
    logError("GET_SOCIAL_LINKS_BY_ID", err, res);
  }
};

export const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const socialLinks = await socialLinksService.updateSocialLinks(req.params.id, req.body);
    res.json(socialLinks);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Social links not found for update." });
    }
    logError("UPDATE_SOCIAL_LINKS", err, res);
  }
};

export const deleteSocialLinks = async (req: Request, res: Response) => {
  try {
    await socialLinksService.deleteSocialLinks(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Social links not found for delete." });
    }
    logError("DELETE_SOCIAL_LINKS", err, res);
  }
};

