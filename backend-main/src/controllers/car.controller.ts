// src/controllers/car.controller.ts (Updated Error Handling)

import { Request, Response } from "express";
import { CarService } from "../services/car.service";
import { Prisma } from "@prisma/client"; // Import Prisma for error type checking

const carService = new CarService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
    // Check if the error is a known Prisma Client error (like unique constraint failure)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
        // In the console, log the whole stack trace
        if (err.stack) console.error(err.stack); 
        
        // Use a 400 for client input issues or 409 for conflicts
        if (err.code === 'P2002') { // Unique constraint violation
            return res.status(409).json({ error: `Conflict: This car listing already exists or data is duplicated. Field: ${err.meta?.target}` });
        }
        // General Prisma Client known errors are still server-side to the user
        return res.status(400).json({ error: "Invalid data provided for car listing." });
    } 
    
    // Check if it's a validation error (often thrown directly by a service function)
    if (err.name === 'ValidationError') {
         console.error(`[ERROR] ${endpoint} Validation Error:`, err.message);
         return res.status(400).json({ error: err.message });
    }

    // Log general server errors (500)
    console.error(`[FATAL ERROR] ${endpoint} Unhandled Error:`, err);
    console.error(`Request Body:`, res.req.body); // Log the request body for 500 errors
    res.status(500).json({ error: "An unexpected server error occurred." });
};


export const createCar = async (req: Request, res: Response) => {
    try {
        const car = await carService.createCar(req.body);
        res.status(201).json(car);
    } catch (err: any) {
        logError("CREATE_CAR", err, res);
    }
};

// ... (apply logError to getCars, getCarById, updateCar, deleteCar, and searchCars) ...

export const getCars = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;
        let filter: any = {};
        // ... (existing filtering logic) ...
        const cars = await carService.getCars(filter);
        res.json(cars);
    } catch (err: any) {
        logError("GET_CARS", err, res);
    }
};

export const getCarById = async (req: Request, res: Response) => {
    try {
        const car = await carService.getCarById(req.params.id);
        if (!car) return res.status(404).json({ error: "Car not found" });
        res.json(car);
    } catch (err: any) {
        logError("GET_CAR_BY_ID", err, res);
    }
};

export const updateCar = async (req: Request, res: Response) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
        res.json(car);
    } catch (err: any) {
        // Special check for update/delete attempts on non-existent records
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ error: "Car not found for update/delete." });
        }
        logError("UPDATE_CAR", err, res);
    }
};

export const deleteCar = async (req: Request, res: Response) => {
    try {
        await carService.deleteCar(req.params.id);
        res.status(204).send();
    } catch (err: any) {
        // Special check for update/delete attempts on non-existent records
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ error: "Car not found for update/delete." });
        }
        logError("DELETE_CAR", err, res);
    }
};

export const searchCars = async (req: Request, res: Response) => {
    try {
        const filters = req.body; 
        const results = await carService.searchCars(filters);
        res.json({ results });
    } catch (err: any) {
        logError("SEARCH_CARS", err, res);
    }
};