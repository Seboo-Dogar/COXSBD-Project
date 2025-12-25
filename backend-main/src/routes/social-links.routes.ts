import { Router } from "express";
import {
  createSocialLinks,
  getSocialLinks,
  getSocialLinksById,
  updateSocialLinks,
  deleteSocialLinks,
} from "../controllers/social-links.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateSocialLinksDto, UpdateSocialLinksDto } from "../dtos/social-links.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/social-links/ - Create a new social links
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateSocialLinksDto),
  createSocialLinks
);

// PUT /api/social-links/:id - Update an existing social links
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateSocialLinksDto),
  updateSocialLinks
);

// DELETE /api/social-links/:id - Delete a social links
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteSocialLinks
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/social-links/ - Get the social links (global settings for the web app)
router.get("/", getSocialLinks);

// GET /api/social-links/:id - Get a single social links by ID
router.get("/:id", getSocialLinksById);

export default router;

