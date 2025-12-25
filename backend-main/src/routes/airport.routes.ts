import { Router } from "express";
import {
  createAirport,
  getAirports,
  getAirportById,
  getAirportByCode,
  updateAirport,
  deleteAirport,
  getActiveAirports,
} from "../controllers/airport.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateAirportDto, UpdateAirportDto } from "../dtos/airport.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/airports/ - Create a new airport
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateAirportDto),
  createAirport
);

// PUT /api/airports/:id - Update an existing airport
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateAirportDto),
  updateAirport
);

// DELETE /api/airports/:id - Delete an airport
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteAirport
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/airports/ - Get all airports (with optional query filters like status, country, city)
router.get("/", getAirports);

// GET /api/airports/active - Get only active airports
router.get("/active", getActiveAirports);

// GET /api/airports/code/:code - Get airport by code
router.get("/code/:code", getAirportByCode);

// GET /api/airports/:id - Get a single airport by ID
router.get("/:id", getAirportById);

export default router;

