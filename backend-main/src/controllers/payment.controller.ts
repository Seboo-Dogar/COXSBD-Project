import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import SSLCommerzService from "../services/sslCommerz.service";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../dtos/payment.dto";

export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private sslCommerzService: SSLCommerzService,
  ) {}

  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreatePaymentDto, req.body);
      await validateOrReject(dto);

      const payment = await this.paymentService.createPayment(dto);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  }

  async initiateSSLCommerzPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const paymentId = req.params.id;
      const result = await this.sslCommerzService.initiatePayment(paymentId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async sslCommerzSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.sslCommerzService.handleSuccess(req.body);
      const queryParams = new URLSearchParams({
        status: "success",
        booking_id: result.payment.bookingId,
        payment_id: result.payment.id,
        transaction_id: result.payment.transactionId || "",
        amount: result.payment.amount.toString(),
      });
      res.redirect(`http://localhost:3000/payment/success?${queryParams}`);
    } catch (error: any) {
      const errorParams = new URLSearchParams({
        status: "error",
        error: error.message,
      });
      res.redirect(`http://localhost:3000/payment/failed?${errorParams}`);
    }
  }

  async sslCommerzFail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.sslCommerzService.handleFail(req.body);
      const queryParams = new URLSearchParams({
        status: "failed",
        transaction_id: req.body.tran_id || "",
        error: result.error || "Payment failed",
      });
      res.redirect(`http://localhost:3000/payment/failed?${queryParams}`);
    } catch (error: any) {
      res.redirect(
        `http://localhost:3000/payment/failed?error=${error.message}`,
      );
    }
  }

  async sslCommerzCancel(req: Request, res: Response, next: NextFunction) {
    try {
      await this.sslCommerzService.handleCancel(req.body);
      const queryParams = new URLSearchParams({
        status: "cancelled",
        transaction_id: req.body.tran_id || "",
      });
      res.redirect(`http://localhost:3000/payment/cancelled?${queryParams}`);
    } catch (error: any) {
      res.redirect(
        `http://localhost:3000/payment/failed?error=${error.message}`,
      );
    }
  }

  async sslCommerzIPN(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.sslCommerzService.validatePayment(req.body);
      res.json({ status: "success", data: result });
    } catch (error: any) {
      res.json({ status: "error", message: error.message });
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const dto = plainToInstance(UpdatePaymentStatusDto, req.body);
      await validateOrReject(dto);

      const updatedPayment = await this.paymentService.updatePaymentStatus(
        id,
        dto,
      );
      res.json(updatedPayment);
    } catch (err) {
      next(err);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const payment = await this.paymentService.getPaymentById(id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  async getPaymentsByBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.bookingId;
      const payments =
        await this.paymentService.getPaymentsByBooking(bookingId);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  }

  async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const skip = Number(req.query.skip) || 0;
      const take = Number(req.query.take) || 10;
      const payments = await this.paymentService.getAllPayments(skip, take);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  }

  async processRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const refundAmount = req.body.refundAmount;
      const result = await this.paymentService.processRefund(id, refundAmount);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
