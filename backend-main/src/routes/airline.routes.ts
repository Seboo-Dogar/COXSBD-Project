import { Router } from "express";
import {
  createAirline,
  getAirlines,
  getAirlineById,
  updateAirline,
  deleteAirline,
  getActiveAirlines,
} from "../controllers/airline.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateAirlineDto, UpdateAirlineDto } from "../dtos/airline.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/airlines/ - Create a new airline
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateAirlineDto),
  createAirline
);

// PUT /api/airlines/:id - Update an existing airline
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateAirlineDto),
  updateAirline
);

// DELETE /api/airlines/:id - Delete an airline
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteAirline
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/airlines/ - Get all airlines (with optional query filters like status)
router.get("/", getAirlines);

// GET /api/airlines/active - Get only active airlines
router.get("/active", getActiveAirlines);

// GET /api/airlines/:id - Get a single airline by ID
router.get("/:id", getAirlineById);

export default router;

