import { Router } from "express";
import {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
  getActiveTours,
  getFeaturedTours,
  getToursWithOffers,
} from "../controllers/tour.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateTourDto, UpdateTourDto } from "../dtos/tour.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/tours/ - Create a new tour
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateTourDto),
  createTour
);

// PUT /api/tours/:id - Update an existing tour
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateTourDto),
  updateTour
);

// DELETE /api/tours/:id - Delete a tour
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteTour
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/tours/ - Get all tours (with optional query filters and pagination)
router.get("/", getTours);

// GET /api/tours/active - Get only active tours
router.get("/active", getActiveTours);

// GET /api/tours/featured - Get only featured tours
router.get("/featured", getFeaturedTours);

// GET /api/tours/offers - Get tours with offers
router.get("/offers", getToursWithOffers);

// GET /api/tours/:id - Get a single tour by ID
router.get("/:id", getTourById);

export default router;

