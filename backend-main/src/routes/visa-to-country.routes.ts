import { Router } from "express";
import {
  createVisaToCountry,
  getVisaToCountries,
  getVisaToCountryById,
  getVisaToCountryByIso,
  updateVisaToCountry,
  deleteVisaToCountry,
  getActiveVisaToCountries,
  getAllVisaToCountries,
} from "../controllers/visa-to-country.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateVisaToCountryDto, UpdateVisaToCountryDto } from "../dtos/visa-to-country.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/visa-to-countries/ - Create a new visa to country
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateVisaToCountryDto),
  createVisaToCountry
);

// PUT /api/visa-to-countries/:id - Update an existing visa to country
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateVisaToCountryDto),
  updateVisaToCountry
);

// DELETE /api/visa-to-countries/:id - Delete a visa to country
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteVisaToCountry
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/visa-to-countries/ - Get all visa to countries (with optional query filters and pagination)
router.get("/", getVisaToCountries);

// GET /api/visa-to-countries/active - Get only active visa to countries
router.get("/active", getActiveVisaToCountries);

// GET /api/visa-to-countries/all - Get all active visa to countries (no pagination, for dropdowns)
router.get("/all", getAllVisaToCountries);

// GET /api/visa-to-countries/iso/:iso - Get a visa to country by ISO code
router.get("/iso/:iso", getVisaToCountryByIso);

// GET /api/visa-to-countries/:id - Get a single visa to country by ID
router.get("/:id", getVisaToCountryById);

export default router;

