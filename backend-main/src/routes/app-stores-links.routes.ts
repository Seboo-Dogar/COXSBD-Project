import { Router } from "express";
import {
  createAppStoresLinks,
  getAppStoresLinks,
  getAppStoresLinksById,
  updateAppStoresLinks,
  deleteAppStoresLinks,
} from "../controllers/app-stores-links.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateAppStoresLinksDto, UpdateAppStoresLinksDto } from "../dtos/app-stores-links.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/app-stores-links/ - Create a new app stores links
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateAppStoresLinksDto),
  createAppStoresLinks
);

// PUT /api/app-stores-links/:id - Update an existing app stores links
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateAppStoresLinksDto),
  updateAppStoresLinks
);

// DELETE /api/app-stores-links/:id - Delete an app stores links
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteAppStoresLinks
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/app-stores-links/ - Get the app stores links (global settings for the web app)
router.get("/", getAppStoresLinks);

// GET /api/app-stores-links/:id - Get a single app stores links by ID
router.get("/:id", getAppStoresLinksById);

export default router;

