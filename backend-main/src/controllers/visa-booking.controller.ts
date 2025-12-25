import { Request, Response } from "express";
import { VisaBookingService } from "../services/visa-booking.service";
import { Prisma, VisaStatus } from "@prisma/client";

const visaBookingService = new VisaBookingService();

// Helper function to log detailed errors
const logError = (endpoint: string, err: any, res: Response) => {
  // Check if the error is a known Prisma Client error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[ERROR] ${endpoint} Prisma Known Error (Code ${err.code}):`, err.message);
    if (err.stack) console.error(err.stack);

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: `Conflict: This visa booking already exists. Field: ${err.meta?.target}`,
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Visa booking not found." });
    }
    return res.status(400).json({ error: "Invalid data provided for visa booking." });
  }

  // Check if it's a validation error
  if (err.name === 'ValidationError') {
    console.error(`[ERROR] ${endpoint} Validation Error:`, err.message);
    return res.status(400).json({ error: err.message });
  }

  // Log general server errors
  console.error(`[FATAL ERROR] ${endpoint} Unhandled Error:`, err);
  console.error(`Request Body:`, res.req.body);
  res.status(500).json({ error: "An unexpected server error occurred." });
};

export const createVisaBooking = async (req: Request, res: Response) => {
  try {
    const visaBooking = await visaBookingService.createVisaBooking(req.body);
    res.status(201).json(visaBooking);
  } catch (err: any) {
    logError("CREATE_VISA_BOOKING", err, res);
  }
};

export const getVisaBookings = async (req: Request, res: Response) => {
  try {
    const { status, fromCountryId, toCountryId, email, phone, date, page, limit, skip, take } = req.query;
    let filter: any = {};

    if (status) {
      filter.status = status as VisaStatus;
    }

    if (fromCountryId) {
      filter.fromCountryId = fromCountryId as string;
    }

    if (toCountryId) {
      filter.toCountryId = toCountryId as string;
    }

    if (email) {
      filter.email = { contains: email as string };
    }

    if (phone) {
      filter.phone = { contains: phone as string };
    }

    if (date) {
      const dateValue = new Date(date as string);
      if (!isNaN(dateValue.getTime())) {
        // Filter by date (ignoring time)
        const startOfDay = new Date(dateValue);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateValue);
        endOfDay.setHours(23, 59, 59, 999);
        filter.date = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }

    // Support both page/limit and skip/take patterns
    let skipValue = 0;
    let takeValue = 10;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      skipValue = (pageNum - 1) * limitNum;
      takeValue = limitNum;
    } else if (skip !== undefined || take !== undefined) {
      skipValue = Math.max(0, parseInt(skip as string) || 0);
      takeValue = Math.max(1, parseInt(take as string) || 10);
    }

    const result = await visaBookingService.getVisaBookings(filter, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_VISA_BOOKINGS", err, res);
  }
};

export const getVisaBookingById = async (req: Request, res: Response) => {
  try {
    const visaBooking = await visaBookingService.getVisaBookingById(req.params.id);
    if (!visaBooking) return res.status(404).json({ error: "Visa booking not found" });
    res.json(visaBooking);
  } catch (err: any) {
    logError("GET_VISA_BOOKING_BY_ID", err, res);
  }
};

export const updateVisaBooking = async (req: Request, res: Response) => {
  try {
    const visaBooking = await visaBookingService.updateVisaBooking(req.params.id, req.body);
    res.json(visaBooking);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa booking not found for update." });
    }
    logError("UPDATE_VISA_BOOKING", err, res);
  }
};

export const deleteVisaBooking = async (req: Request, res: Response) => {
  try {
    await visaBookingService.deleteVisaBooking(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Visa booking not found for delete." });
    }
    logError("DELETE_VISA_BOOKING", err, res);
  }
};

export const getVisaBookingsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const { page, limit, skip, take } = req.query;

    // Validate status enum
    if (!Object.values(VisaStatus).includes(status as VisaStatus)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${Object.values(VisaStatus).join(', ')}` });
    }

    // Support both page/limit and skip/take patterns
    let skipValue = 0;
    let takeValue = 10;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      skipValue = (pageNum - 1) * limitNum;
      takeValue = limitNum;
    } else if (skip !== undefined || take !== undefined) {
      skipValue = Math.max(0, parseInt(skip as string) || 0);
      takeValue = Math.max(1, parseInt(take as string) || 10);
    }

    const result = await visaBookingService.getVisaBookingsByStatus(status as VisaStatus, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_VISA_BOOKINGS_BY_STATUS", err, res);
  }
};

export const getVisaBookingsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { page, limit, skip, take } = req.query;

    // Support both page/limit and skip/take patterns
    let skipValue = 0;
    let takeValue = 10;

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      skipValue = (pageNum - 1) * limitNum;
      takeValue = limitNum;
    } else if (skip !== undefined || take !== undefined) {
      skipValue = Math.max(0, parseInt(skip as string) || 0);
      takeValue = Math.max(1, parseInt(take as string) || 10);
    }

    const result = await visaBookingService.getVisaBookingsByEmail(email, skipValue, takeValue);
    res.json(result);
  } catch (err: any) {
    logError("GET_VISA_BOOKINGS_BY_EMAIL", err, res);
  }
};

