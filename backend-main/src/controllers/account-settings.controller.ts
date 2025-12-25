import { Request, Response } from "express";
import { AccountSettingsService } from "../services/account-settings.service";
import { Prisma } from "@prisma/client";

const accountSettingsService = new AccountSettingsService();

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
      return res.status(404).json({ error: "Account settings not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for account settings." });
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

export const createAccountSettings = async (req: Request, res: Response) => {
  try {
    const settings = await accountSettingsService.createAccountSettings(req.body);
    res.status(201).json(settings);
  } catch (err: any) {
    logError("CREATE_ACCOUNT_SETTINGS", err, res);
  }
};

export const getAccountSettings = async (req: Request, res: Response) => {
  try {
    const settings = await accountSettingsService.getAccountSettings();
    if (!settings) return res.status(404).json({ error: "Account settings not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_ACCOUNT_SETTINGS", err, res);
  }
};

export const getAccountSettingsById = async (req: Request, res: Response) => {
  try {
    const settings = await accountSettingsService.getAccountSettingsById(req.params.id);
    if (!settings) return res.status(404).json({ error: "Account settings not found" });
    res.json(settings);
  } catch (err: any) {
    logError("GET_ACCOUNT_SETTINGS_BY_ID", err, res);
  }
};

export const updateAccountSettings = async (req: Request, res: Response) => {
  try {
    const settings = await accountSettingsService.updateAccountSettings(req.params.id, req.body);
    res.json(settings);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Account settings not found for update." });
    }
    logError("UPDATE_ACCOUNT_SETTINGS", err, res);
  }
};

export const deleteAccountSettings = async (req: Request, res: Response) => {
  try {
    await accountSettingsService.deleteAccountSettings(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Account settings not found for delete." });
    }
    logError("DELETE_ACCOUNT_SETTINGS", err, res);
  }
};

