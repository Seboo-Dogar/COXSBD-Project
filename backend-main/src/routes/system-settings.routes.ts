import { Router } from "express";
import {
  createSystemSettings,
  getSystemSettings,
  getSystemSettingsById,
  updateSystemSettings,
  deleteSystemSettings,
} from "../controllers/system-settings.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateSystemSettingsDto, UpdateSystemSettingsDto } from "../dtos/system-settings.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/system-settings/ - Create a new system settings
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateSystemSettingsDto),
  createSystemSettings
);

// PUT /api/system-settings/:id - Update an existing system settings
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateSystemSettingsDto),
  updateSystemSettings
);

// DELETE /api/system-settings/:id - Delete a system settings
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteSystemSettings
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/system-settings/ - Get the system settings (global settings for the web app)
router.get("/", getSystemSettings);

// GET /api/system-settings/:id - Get a single system settings by ID
router.get("/:id", getSystemSettingsById);

export default router;

