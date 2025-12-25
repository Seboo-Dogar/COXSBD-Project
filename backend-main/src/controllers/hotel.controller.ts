// src/controllers/hotel.controller.ts

import { Request, Response } from "express";
import { HotelService } from "../services/hotel.service";

const hotelService = new HotelService();

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ error: "Failed to create hotel" });
  }
};

// Updated getHotels with featured filter support
export const getHotels = async (req: Request, res: Response) => {
  try {
    const { featured } = req.query;

    // Build filter object if featured is true
    const filter = featured === "true" ? { featured: true } : {};

    const hotels = await hotelService.getHotels(filter);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update hotel" });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    await hotelService.deleteHotel(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hotel" });
  }
};

export const searchHotels = async (req: Request, res: Response) => {
  try {
    const filters = req.body; // e.g. location, checkIn, checkOut, guests, rooms etc.

    // Implement your search logic inside HotelService
    const results = await hotelService.searchHotels(filters);

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Failed to search hotels" });
  }
};
