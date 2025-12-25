// src/dtos/payment.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
} from "class-validator";
import { Currency } from "@prisma/client";

// Payment status enum matching your Prisma enum values
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

// DTO for creating a new payment
export class CreatePaymentDto {
  @IsString()
  bookingId!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsString()
  method?: string; // e.g. 'sslcommerz', 'bkash'

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus; // Optional, usually defaulted to PENDING on creation

  @IsOptional()
  @IsString()
  gatewayName?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  customerPhone?: string;
}

// DTO for updating payment status
export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  gatewayReference?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  paidAt?: string; // ISO date string

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
