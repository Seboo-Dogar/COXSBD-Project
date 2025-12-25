import { BadRequestException, NotFoundException } from "../utils/errors"; // define your own or use http-errors
import { DatabaseService } from "../database-prisma/database.service";
import {
  CreatePaymentDto,
  UpdatePaymentStatusDto,
  PaymentStatus,
} from "../dtos/payment.dto";

export class PaymentService {
  constructor(private readonly database: DatabaseService) {}

  async createPayment(dto: CreatePaymentDto) {
    const booking = await this.database.booking.findUnique({
      where: { id: dto.bookingId },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.payment && booking.payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException("Booking is already paid");
    }

    const payment = await this.database.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        currency: dto.currency,
        method: dto.method,
        status: PaymentStatus.PENDING,
        gatewayName: dto.gatewayName,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
      },
      include: {
        booking: { include: { hotel: true, roomType: true, user: true } },
      },
    });

    return payment;
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.database.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException("Payment not found");

    const updateData: any = {
      status: dto.status,
      transactionId: dto.transactionId,
      gatewayReference: dto.gatewayReference,
      failureReason: dto.failureReason,
    };

    if (dto.status === PaymentStatus.SUCCESS && dto.paidAt) {
      updateData.paidAt = new Date(dto.paidAt);
      // Update booking status to CONFIRMED when payment completes
      await this.database.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" }, // adjust to your enum/value
      });
    }

    const updatedPayment = await this.database.payment.update({
      where: { id },
      data: updateData,
      include: {
        booking: { include: { hotel: true, roomType: true, user: true } },
      },
    });

    return updatedPayment;
  }

  async getPaymentById(id: string) {
    const payment = await this.database.payment.findUnique({
      where: { id },
      include: {
        booking: { include: { hotel: true, roomType: true, user: true } },
      },
    });

    if (!payment) throw new NotFoundException("Payment not found");

    return payment;
  }

  async getPaymentsByBooking(bookingId: string) {
    return this.database.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { hotel: true, roomType: true } } },
    });
  }

  async getAllPayments(skip = 0, take = 10) {
    const [payments, total] = await Promise.all([
      this.database.payment.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          booking: { include: { hotel: true, roomType: true, user: true } },
        },
      }),
      this.database.payment.count(),
    ]);

    return {
      payments,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async processRefund(paymentId: string, refundAmount?: number) {
    const payment = await this.database.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException("Payment not found");
    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException("Can only refund completed payments");
    }

    const finalRefundAmount = refundAmount ?? payment.amount;

    if (finalRefundAmount > payment.amount) {
      throw new BadRequestException(
        "Refund amount cannot exceed payment amount",
      );
    }

    const updatedPayment = await this.database.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REFUNDED,
        refundAmount: finalRefundAmount,
        refundedAt: new Date(),
      },
      include: {
        booking: { include: { hotel: true, roomType: true, user: true } },
      },
    });

    await this.database.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CANCELLED" },
    });

    return updatedPayment;
  }
}
