import { Router } from "express";
import {
  createFlightSuggestion,
  getFlightSuggestions,
  getFlightSuggestionById,
  updateFlightSuggestion,
  deleteFlightSuggestion,
  getActiveFlightSuggestions,
} from "../controllers/flight-suggestion.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateFlightSuggestionDto, UpdateFlightSuggestionDto } from "../dtos/flight-suggestion.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/flight-suggestion/ - Create a new flight suggestion
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateFlightSuggestionDto),
  createFlightSuggestion
);

// PUT /api/flight-suggestion/:id - Update an existing flight suggestion
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateFlightSuggestionDto),
  updateFlightSuggestion
);

// DELETE /api/flight-suggestion/:id - Delete a flight suggestion
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteFlightSuggestion
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/flight-suggestion/ - Get all flight suggestions (with optional query filters and pagination)
router.get("/", getFlightSuggestions);

// GET /api/flight-suggestion/active - Get only active flight suggestions
router.get("/active", getActiveFlightSuggestions);

// GET /api/flight-suggestion/:id - Get a single flight suggestion by ID
router.get("/:id", getFlightSuggestionById);

export default router;

