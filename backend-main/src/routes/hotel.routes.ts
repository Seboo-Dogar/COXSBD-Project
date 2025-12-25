// src/routes/hotel.routes.ts
import { Router } from "express";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controllers/hotel.controller";
import { searchHotels } from "../controllers/hotel.controller";

const router = Router();

router.post("/", createHotel);
router.get("/", getHotels);
router.get("/:id", getHotelById);
router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);
router.post("/search-all", searchHotels);

export default router;
