import { Router } from "express";
import {
  createTourSuggestion,
  getTourSuggestions,
  getTourSuggestionById,
  updateTourSuggestion,
  deleteTourSuggestion,
  getActiveTourSuggestions,
} from "../controllers/tour-suggestion.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateTourSuggestionDto, UpdateTourSuggestionDto } from "../dtos/tour-suggestion.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/tour-suggestion/ - Create a new tour suggestion
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateTourSuggestionDto),
  createTourSuggestion
);

// PUT /api/tour-suggestion/:id - Update an existing tour suggestion
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateTourSuggestionDto),
  updateTourSuggestion
);

// DELETE /api/tour-suggestion/:id - Delete a tour suggestion
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteTourSuggestion
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/tour-suggestion/ - Get all tour suggestions (with optional query filters and pagination)
router.get("/", getTourSuggestions);

// GET /api/tour-suggestion/active - Get only active tour suggestions
router.get("/active", getActiveTourSuggestions);

// GET /api/tour-suggestion/:id - Get a single tour suggestion by ID
router.get("/:id", getTourSuggestionById);

export default router;

