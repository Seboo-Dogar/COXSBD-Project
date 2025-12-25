import { Router } from "express";
import { 
  getAllBusTrips, 
  getTripDetails, 
  getAvailableSeats, 
  bookSeats, 
  createTrip, 
  updateTrip, 
  deleteTrip 
} from "../controllers/bus.controller";

const router = Router();

// Client routes
router.get("/", getAllBusTrips);
router.get("/:id", getTripDetails);
router.get("/:id/available-seats", getAvailableSeats);
router.post("/:id/book", bookSeats);

// Admin routes
router.post("/", createTrip);
router.patch("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;