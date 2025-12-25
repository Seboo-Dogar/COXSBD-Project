import { Router } from "express";
import {
  createTourExclusion,
  getTourExclusions,
  getTourExclusionById,
  getTourExclusionByName,
  updateTourExclusion,
  deleteTourExclusion,
  getAllTourExclusions,
} from "../controllers/tour-exclusion.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateTourExclusionDto, UpdateTourExclusionDto } from "../dtos/tour-exclusion.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/tour-exclusion/ - Create a new tour exclusion
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateTourExclusionDto),
  createTourExclusion
);

// PUT /api/tour-exclusion/:id - Update an existing tour exclusion
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateTourExclusionDto),
  updateTourExclusion
);

// DELETE /api/tour-exclusion/:id - Delete a tour exclusion
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteTourExclusion
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/tour-exclusion/ - Get all tour exclusions (with optional query filters and pagination)
router.get("/", getTourExclusions);

// GET /api/tour-exclusion/all - Get all tour exclusions without pagination (for dropdowns)
router.get("/all", getAllTourExclusions);

// GET /api/tour-exclusion/name/:name - Get tour exclusion by name
router.get("/name/:name", getTourExclusionByName);

// GET /api/tour-exclusion/:id - Get a single tour exclusion by ID
router.get("/:id", getTourExclusionById);

export default router;

