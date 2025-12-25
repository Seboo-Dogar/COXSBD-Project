import { Router } from "express";
import {
  createFlightFeatured,
  getFlightFeatureds,
  getFlightFeaturedById,
  updateFlightFeatured,
  deleteFlightFeatured,
  getActiveFlightFeatureds,
} from "../controllers/flight-featured.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateFlightFeaturedDto, UpdateFlightFeaturedDto } from "../dtos/flight-featured.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/flight-featured/ - Create a new featured flight
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateFlightFeaturedDto),
  createFlightFeatured
);

// PUT /api/flight-featured/:id - Update an existing featured flight
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateFlightFeaturedDto),
  updateFlightFeatured
);

// DELETE /api/flight-featured/:id - Delete a featured flight
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteFlightFeatured
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/flight-featured/ - Get all featured flights (with optional query filters and pagination)
router.get("/", getFlightFeatureds);

// GET /api/flight-featured/active - Get only active featured flights
router.get("/active", getActiveFlightFeatureds);

// GET /api/flight-featured/:id - Get a single featured flight by ID
router.get("/:id", getFlightFeaturedById);

export default router;

