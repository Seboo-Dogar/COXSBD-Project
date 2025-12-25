// src/routes/car.routes.ts

import { Router } from "express";
import {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  searchCars,
} from "../controllers/car.controller";
// Using the file name as provided (acessToken.middleware)
import { accessTokenMiddleware } from "../middlewares/accessToken.middleware"; 
import { validationMiddleware } from "../middlewares/validator-middleware"; 
import { isAdmin } from "../middlewares/isAdmin.middleware"; 
import { CreateCarDto, UpdateCarDto } from "../dtos/car.dto"; 

const router = Router();

// =================================================
// 1. ADMIN-ONLY ROUTES (CRUD)
// Requires: Token Validation -> Authorization Check -> Input Validation
// =================================================

// POST /api/cars/ - Create a new car listing
router.post(
  "/", 
  accessTokenMiddleware, 
  isAdmin, 
  validationMiddleware(CreateCarDto), 
  createCar
);

// PUT /api/cars/:id - Update an existing car listing
router.put(
  "/:id", 
  accessTokenMiddleware, 
  isAdmin, 
  validationMiddleware(UpdateCarDto), 
  updateCar
);

// DELETE /api/cars/:id - Delete a car listing
router.delete("/:id", accessTokenMiddleware, isAdmin, deleteCar);


// =================================================
// 2. PUBLIC ROUTES (READ & SEARCH)
// These are public endpoints for all users.
// =================================================

// GET /api/cars/ - Get all cars (with optional query filters like category)
router.get("/", getCars);

// GET /api/cars/:id - Get a single car by ID
router.get("/:id", getCarById);

// POST /api/cars/search-all - Specialized search route for complex filtering 
router.post("/search-all", searchCars); 


export default router;