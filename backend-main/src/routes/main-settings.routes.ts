import { Router } from "express";
import {
  createMainSettings,
  getMainSettings,
  getMainSettingsById,
  updateMainSettings,
  deleteMainSettings,
} from "../controllers/main-settings.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateMainSettingsDto, UpdateMainSettingsDto } from "../dtos/main-settings.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/main-settings/ - Create a new main settings
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateMainSettingsDto),
  createMainSettings
);

// PUT /api/main-settings/:id - Update an existing main settings
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateMainSettingsDto),
  updateMainSettings
);

// DELETE /api/main-settings/:id - Delete a main settings
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteMainSettings
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/main-settings/ - Get the main settings (global settings for the web app)
router.get("/", getMainSettings);

// GET /api/main-settings/:id - Get a single main settings by ID
router.get("/:id", getMainSettingsById);

export default router;

