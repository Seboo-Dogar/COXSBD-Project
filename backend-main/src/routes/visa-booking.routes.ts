import { Router } from "express";
import {
  createVisaBooking,
  getVisaBookings,
  getVisaBookingById,
  updateVisaBooking,
  deleteVisaBooking,
  getVisaBookingsByStatus,
  getVisaBookingsByEmail,
} from "../controllers/visa-booking.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateVisaBookingDto, UpdateVisaBookingDto } from "../dtos/visa-booking.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/visa-bookings/ - Create a new visa booking
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateVisaBookingDto),
  createVisaBooking
);

// PUT /api/visa-bookings/:id - Update an existing visa booking
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateVisaBookingDto),
  updateVisaBooking
);

// DELETE /api/visa-bookings/:id - Delete a visa booking
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteVisaBooking
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/visa-bookings/ - Get all visa bookings (with optional query filters and pagination)
router.get("/", getVisaBookings);

// GET /api/visa-bookings/status/:status - Get visa bookings by status (WAITING, PROGRESS, DONE)
router.get("/status/:status", getVisaBookingsByStatus);

// GET /api/visa-bookings/email/:email - Get visa bookings by email
router.get("/email/:email", getVisaBookingsByEmail);

// GET /api/visa-bookings/:id - Get a single visa booking by ID
router.get("/:id", getVisaBookingById);

export default router;

