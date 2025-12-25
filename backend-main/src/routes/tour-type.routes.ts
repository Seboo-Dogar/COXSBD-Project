import { Router } from "express";
import {
  createTourType,
  getTourTypes,
  getTourTypeById,
  getTourTypeByName,
  updateTourType,
  deleteTourType,
  getAllTourTypes,
} from "../controllers/tour-type.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateTourTypeDto, UpdateTourTypeDto } from "../dtos/tour-type.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/tour-type/ - Create a new tour type
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateTourTypeDto),
  createTourType
);

// PUT /api/tour-type/:id - Update an existing tour type
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateTourTypeDto),
  updateTourType
);

// DELETE /api/tour-type/:id - Delete a tour type
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteTourType
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/tour-type/ - Get all tour types (with optional query filters and pagination)
router.get("/", getTourTypes);

// GET /api/tour-type/all - Get all tour types without pagination (for dropdowns)
router.get("/all", getAllTourTypes);

// GET /api/tour-type/name/:name - Get tour type by name
router.get("/name/:name", getTourTypeByName);

// GET /api/tour-type/:id - Get a single tour type by ID
router.get("/:id", getTourTypeById);

export default router;

