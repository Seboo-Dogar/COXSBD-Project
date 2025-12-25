import { Router } from "express";
import {
  createLanguageCurrencies,
  getLanguageCurrencies,
  getLanguageCurrenciesById,
  updateLanguageCurrencies,
  deleteLanguageCurrencies,
} from "../controllers/language-currencies.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateLanguageCurrenciesDto, UpdateLanguageCurrenciesDto } from "../dtos/language-currencies.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/language-currencies/ - Create a new language currencies
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateLanguageCurrenciesDto),
  createLanguageCurrencies
);

// PUT /api/language-currencies/:id - Update an existing language currencies
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateLanguageCurrenciesDto),
  updateLanguageCurrencies
);

// DELETE /api/language-currencies/:id - Delete a language currencies
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteLanguageCurrencies
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/language-currencies/ - Get the language currencies (global settings for the web app)
router.get("/", getLanguageCurrencies);

// GET /api/language-currencies/:id - Get a single language currencies by ID
router.get("/:id", getLanguageCurrenciesById);

export default router;

