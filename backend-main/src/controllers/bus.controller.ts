import { Request, Response } from "express";
import { BusService } from "../services/bus.service";

export const getAllBusTrips = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.query.role === "admin";
    const trips = await BusService.getAllTrips(isAdmin);
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

export const getTripDetails = async (req: Request, res: Response) => {
  try {
    const trip = await BusService.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching details", error });
  }
};

export const getAvailableSeats = async (req: Request, res: Response) => {
  try {
    const seats = await BusService.getAvailableSeatList(req.params.id);
    res.status(200).json({ availableSeats: seats });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const bookSeats = async (req: Request, res: Response) => {
  try {
    const { seatNumbers } = req.body;
    const updated = await BusService.reserveSeats(req.params.id, seatNumbers);
    res.status(200).json({ message: "Seats reserved successfully", data: updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const trip = await BusService.createTrip(req.body);
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: "Failed to create trip", error });
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await BusService.updateTrip(req.params.id, req.body);
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    await BusService.deleteTrip(req.params.id);
    res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};