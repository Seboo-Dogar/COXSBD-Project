import { Router } from "express";
import {
  createTourInclusion,
  getTourInclusions,
  getTourInclusionById,
  getTourInclusionByName,
  updateTourInclusion,
  deleteTourInclusion,
  getAllTourInclusions,
} from "../controllers/tour-inclusion.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateTourInclusionDto, UpdateTourInclusionDto } from "../dtos/tour-inclusion.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/tour-inclusion/ - Create a new tour inclusion
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateTourInclusionDto),
  createTourInclusion
);

// PUT /api/tour-inclusion/:id - Update an existing tour inclusion
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateTourInclusionDto),
  updateTourInclusion
);

// DELETE /api/tour-inclusion/:id - Delete a tour inclusion
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteTourInclusion
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/tour-inclusion/ - Get all tour inclusions (with optional query filters and pagination)
router.get("/", getTourInclusions);

// GET /api/tour-inclusion/all - Get all tour inclusions without pagination (for dropdowns)
router.get("/all", getAllTourInclusions);

// GET /api/tour-inclusion/name/:name - Get tour inclusion by name
router.get("/name/:name", getTourInclusionByName);

// GET /api/tour-inclusion/:id - Get a single tour inclusion by ID
router.get("/:id", getTourInclusionById);

export default router;

