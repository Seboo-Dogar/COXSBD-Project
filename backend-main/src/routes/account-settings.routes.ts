import { Router } from "express";
import {
  createAccountSettings,
  getAccountSettings,
  getAccountSettingsById,
  updateAccountSettings,
  deleteAccountSettings,
} from "../controllers/account-settings.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateAccountSettingsDto, UpdateAccountSettingsDto } from "../dtos/account-settings.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/account-settings/ - Create a new account settings
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateAccountSettingsDto),
  createAccountSettings
);

// PUT /api/account-settings/:id - Update an existing account settings
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateAccountSettingsDto),
  updateAccountSettings
);

// DELETE /api/account-settings/:id - Delete an account settings
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteAccountSettings
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/account-settings/ - Get the account settings (global settings for the web app)
router.get("/", getAccountSettings);

// GET /api/account-settings/:id - Get a single account settings by ID
router.get("/:id", getAccountSettingsById);

export default router;

