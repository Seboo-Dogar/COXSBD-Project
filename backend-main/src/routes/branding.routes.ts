import { Router } from "express";
import {
  createBranding,
  getBranding,
  getBrandingById,
  updateBranding,
  deleteBranding,
} from "../controllers/branding.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateBrandingDto, UpdateBrandingDto } from "../dtos/branding.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/branding/ - Create a new branding
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateBrandingDto),
  createBranding
);

// PUT /api/branding/:id - Update an existing branding
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateBrandingDto),
  updateBranding
);

// DELETE /api/branding/:id - Delete a branding
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteBranding
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/branding/ - Get the branding (global settings for the web app)
router.get("/", getBranding);

// GET /api/branding/:id - Get a single branding by ID
router.get("/:id", getBrandingById);

export default router;

