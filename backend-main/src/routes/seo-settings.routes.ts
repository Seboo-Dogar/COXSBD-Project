import { Router } from "express";
import {
  createSeoSettings,
  getSeoSettings,
  getSeoSettingsById,
  updateSeoSettings,
  deleteSeoSettings,
} from "../controllers/seo-settings.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateSeoSettingsDto, UpdateSeoSettingsDto } from "../dtos/seo-settings.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/seo-settings/ - Create a new SEO settings
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateSeoSettingsDto),
  createSeoSettings
);

// PUT /api/seo-settings/:id - Update an existing SEO settings
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateSeoSettingsDto),
  updateSeoSettings
);

// DELETE /api/seo-settings/:id - Delete a SEO settings
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteSeoSettings
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/seo-settings/ - Get the SEO settings (global settings for the web app)
router.get("/", getSeoSettings);

// GET /api/seo-settings/:id - Get a single SEO settings by ID
router.get("/:id", getSeoSettingsById);

export default router;

