import { Router } from "express";
import {
  createVisaFromCountry,
  getVisaFromCountries,
  getVisaFromCountryById,
  getVisaFromCountryByIso,
  updateVisaFromCountry,
  deleteVisaFromCountry,
  getActiveVisaFromCountries,
  getAllVisaFromCountries,
} from "../controllers/visa-from-country.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateVisaFromCountryDto, UpdateVisaFromCountryDto } from "../dtos/visa-from-country.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/visa-from-countries/ - Create a new visa from country
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateVisaFromCountryDto),
  createVisaFromCountry
);

// PUT /api/visa-from-countries/:id - Update an existing visa from country
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateVisaFromCountryDto),
  updateVisaFromCountry
);

// DELETE /api/visa-from-countries/:id - Delete a visa from country
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteVisaFromCountry
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/visa-from-countries/ - Get all visa from countries (with optional query filters and pagination)
router.get("/", getVisaFromCountries);

// GET /api/visa-from-countries/active - Get only active visa from countries
router.get("/active", getActiveVisaFromCountries);

// GET /api/visa-from-countries/all - Get all active visa from countries (no pagination, for dropdowns)
router.get("/all", getAllVisaFromCountries);

// GET /api/visa-from-countries/iso/:iso - Get a visa from country by ISO code
router.get("/iso/:iso", getVisaFromCountryByIso);

// GET /api/visa-from-countries/:id - Get a single visa from country by ID
router.get("/:id", getVisaFromCountryById);

export default router;

