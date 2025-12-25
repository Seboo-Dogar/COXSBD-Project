require("dotenv").config(); // 1. Load variables IMMEDIATELY
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const cors = require("cors");
import helmet from "helmet";
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
import hotelRoutes from "./routes/hotel.routes";
import carRoutes from "./routes/car.routes";
import busRoutes from "./routes/bus.routes";
import authRoutes from "./routes/auth.routes";
import airlineRoutes from "./routes/airline.routes";
import airportRoutes from "./routes/airport.routes";
import flightRoutes from "./routes/flight.routes";
import flightFeaturedRoutes from "./routes/flight-featured.routes";
import flightSuggestionRoutes from "./routes/flight-suggestion.routes";
import tourTypeRoutes from "./routes/tour-type.routes";
import tourInclusionRoutes from "./routes/tour-inclusion.routes";
import tourExclusionRoutes from "./routes/tour-exclusion.routes";
import tourSuggestionRoutes from "./routes/tour-suggestion.routes";
import tourRoutes from "./routes/tour.routes";
import visaFromCountryRoutes from "./routes/visa-from-country.routes";
import visaToCountryRoutes from "./routes/visa-to-country.routes";
import visaBookingRoutes from "./routes/visa-booking.routes";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import messageRoutes from "./routes/message.routes";
import currencyRoutes from "./routes/currency.routes";
import userRoutes from "./routes/user.routes";
import mainSettingsRoutes from "./routes/main-settings.routes";
import seoSettingsRoutes from "./routes/seo-settings.routes";
import accountSettingsRoutes from "./routes/account-settings.routes";
import systemSettingsRoutes from "./routes/system-settings.routes";
import contactSettingsRoutes from "./routes/contact-settings.routes";
import appStoresLinksRoutes from "./routes/app-stores-links.routes";
import brandingRoutes from "./routes/branding.routes";
import languageCurrenciesRoutes from "./routes/language-currencies.routes";
import socialLinksRoutes from "./routes/social-links.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

const app = express();
const PORT = process.env.PORT || 1337;

// 2. GLOBAL MIDDLEWARES (Must come before routes)
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:80",
      "http://localhost:8080",
      "https://coxsbd.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added Explicit PUT
    allowedHeaders: ["Content-Type", "Authorization"], // Added Explicit Headers
    credentials: true,
  })
);
app.use(express.json()); // Ensure JSON parsing is enabled for all routes

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bus-trips", busRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/flight-featured", flightFeaturedRoutes);
app.use("/api/flight-suggestion", flightSuggestionRoutes);
app.use("/api/tour-type", tourTypeRoutes);
app.use("/api/tour-inclusion", tourInclusionRoutes);
app.use("/api/tour-exclusion", tourExclusionRoutes);
app.use("/api/tour-suggestion", tourSuggestionRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/visa-from-countries", visaFromCountryRoutes);
app.use("/api/visa-to-countries", visaToCountryRoutes);
app.use("/api/visa-bookings", visaBookingRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/main-settings", mainSettingsRoutes);
app.use("/api/seo-settings", seoSettingsRoutes);
app.use("/api/account-settings", accountSettingsRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use("/api/contact-settings", contactSettingsRoutes);
app.use("/api/app-stores-links", appStoresLinksRoutes);
app.use("/api/branding", brandingRoutes);
app.use("/api/language-currencies", languageCurrenciesRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const prisma = new PrismaClient();

// Create HTTP + Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // TODO: Replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

// REST API to fetch messages
app.get("/messages", async (req: Request, res: Response) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// Socket.IO for real-time messaging
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on(
    "sendMessage",
    async (data: { text: string; senderId: string; receiverId: string }) => {
      try {
        const message = await prisma.message.create({
          data: {
            text: data.text,
            senderId: data.senderId,
            receiverId: data.receiverId,
          },
          include: { sender: true, receiver: true }, // optional: populate user info
        });

        io.emit("receiveMessage", message);
      } catch (err) {
        console.error("Message save error:", err);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CoxsBD Backend API",
      version: "1.0",
      description: "API documentation for CoxsBD Backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.ts"], // Adjust if needed
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Start server with Socket.IO
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
