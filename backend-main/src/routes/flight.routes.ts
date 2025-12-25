import { Router } from "express";
import {
  createFlight,
  getFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  getActiveFlights,
  getFlightsWithOffers,
} from "../controllers/flight.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateFlightDto, UpdateFlightDto } from "../dtos/flight.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/flights/ - Create a new flight
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateFlightDto),
  createFlight
);

// PUT /api/flights/:id - Update an existing flight
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateFlightDto),
  updateFlight
);

// DELETE /api/flights/:id - Delete a flight
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteFlight
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/flights/ - Get all flights (with optional query filters and pagination)
router.get("/", getFlights);

// GET /api/flights/active - Get only active flights
router.get("/active", getActiveFlights);

// GET /api/flights/offers - Get flights with offers
router.get("/offers", getFlightsWithOffers);

// GET /api/flights/:id - Get a single flight by ID
router.get("/:id", getFlightById);

export default router;

