import { Router } from "express";
import {
  createContactSettings,
  getContactSettings,
  getContactSettingsById,
  updateContactSettings,
  deleteContactSettings,
} from "../controllers/contact-settings.controller";
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware";
import { validationMiddleware } from "../middlewares/validator-middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { CreateContactSettingsDto, UpdateContactSettingsDto } from "../dtos/contact-settings.dto";

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/contact-settings/ - Create a new contact settings
router.post(
  "/",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(CreateContactSettingsDto),
  createContactSettings
);

// PUT /api/contact-settings/:id - Update an existing contact settings
router.put(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  validationMiddleware(UpdateContactSettingsDto),
  updateContactSettings
);

// DELETE /api/contact-settings/:id - Delete a contact settings
router.delete(
  "/:id",
  accessTokenMiddleware,
  isAdmin,
  deleteContactSettings
);

// =================================================
// 2. PUBLIC ROUTES (READ)
// These are public endpoints for all users.
// =================================================

// GET /api/contact-settings/ - Get the contact settings (global settings for the web app)
router.get("/", getContactSettings);

// GET /api/contact-settings/:id - Get a single contact settings by ID
router.get("/:id", getContactSettingsById);

export default router;

