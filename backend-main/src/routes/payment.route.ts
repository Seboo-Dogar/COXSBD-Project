import { Router, Request, Response, NextFunction } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { DatabaseService } from "../database-prisma/database.service";
import { PaymentService } from "../services/payment.service";
import SSLCommerzService from "../services/sslCommerz.service";

const router = Router();

// Instantiate shared services
const databaseService = new DatabaseService();

const sslCommerzConfig = {
  SSLC_STORE_ID: process.env.SSLC_STORE_ID || "coxsb688f54556664e",
  SSLC_STORE_PASSWORD:
    process.env.SSLC_STORE_PASSWORD || "coxsb688f54556664e@ssl",
  SSLC_IS_LIVE: process.env.SSLC_IS_LIVE || "false",
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
};

const sslCommerzService = new SSLCommerzService(
  sslCommerzConfig,
  databaseService,
  console,
);
const paymentService = new PaymentService(databaseService);
const paymentController = new PaymentController(
  paymentService,
  sslCommerzService,
);

// More specific routes first to avoid conflicts
router.get(
  "/booking/:bookingId",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.getPaymentsByBooking(req, res, next),
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  paymentController.getPaymentById(req, res, next),
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  paymentController.getAllPayments(req, res, next),
);

router.post("/", (req: Request, res: Response, next: NextFunction) =>
  paymentController.createPayment(req, res, next),
);

router.post(
  "/:id/initiate-sslcommerz",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.initiateSSLCommerzPayment(req, res, next),
);

router.post(
  "/sslcommerz/success",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.sslCommerzSuccess(req, res, next),
);

router.post(
  "/sslcommerz/fail",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.sslCommerzFail(req, res, next),
);

router.post(
  "/sslcommerz/cancel",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.sslCommerzCancel(req, res, next),
);

router.post(
  "/sslcommerz/ipn",
  (req: Request, res: Response, next: NextFunction) =>
    paymentController.sslCommerzIPN(req, res, next),
);

router.put("/:id/status", (req: Request, res: Response, next: NextFunction) =>
  paymentController.updatePaymentStatus(req, res, next),
);

router.put("/:id/refund", (req: Request, res: Response, next: NextFunction) =>
  paymentController.processRefund(req, res, next),
);

export default router;
