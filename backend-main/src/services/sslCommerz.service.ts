//  Updated

import SSLCommerzPayment from "sslcommerz-lts";
import { BadRequestException } from "../utils/errors"; // your custom error
import { PaymentStatus, BookingStatus } from "@prisma/client";
import { DatabaseService } from "../database-prisma/database.service";

interface SSLCommerzConfig {
  SSLC_STORE_ID: string;
  SSLC_STORE_PASSWORD: string;
  SSLC_IS_LIVE?: string;
  BASE_URL: string;
}

class SSLCommerzService {
  private config: SSLCommerzConfig;
  private database: DatabaseService;
  private logger: Console;
  private sslcz: SSLCommerzPayment;

  /**
   * @param config - config object or env vars
   * @param databaseService - database abstraction
   * @param logger - logger (default to console)
   */
  constructor(
    config: SSLCommerzConfig,
    databaseService: DatabaseService,
    logger: Console = console,
  ) {
    this.config = config;
    this.database = databaseService;
    this.logger = logger;

    try {
      const store_id = config.SSLC_STORE_ID || "coxsb688f54556664e";
      const store_passwd =
        config.SSLC_STORE_PASSWORD || "coxsb688f54556664e@ssl";
      const is_live = config.SSLC_IS_LIVE === "true" || false;

      this.logger.log(`Initializing SSLCommerz with Store ID: ${store_id}`);

      this.sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

      this.logger.log("SSLCommerz initialized successfully");
    } catch (error: any) {
      this.logger.error(`SSLCommerz initialization failed: ${error.message}`);
      throw error;
    }
  }

  async initiatePayment(paymentId: string) {
    this.logger.log(`Initiating payment for ID: ${paymentId}`);

    if (!this.sslcz)
      throw new BadRequestException("SSLCommerz not initialized");

    const payment = await this.database.client.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: { hotel: true, roomType: true, user: true },
        },
      },
    });

    if (!payment) {
      this.logger.error(`Payment not found: ${paymentId}`);
      throw new BadRequestException("Payment not found");
    }

    if (payment.status !== PaymentStatus.PENDING) {
      this.logger.error(`Payment status not pending: ${payment.status}`);
      throw new BadRequestException(
        `Payment is not in pending status. Current status: ${payment.status}`,
      );
    }

    // Build payment data object for SSLCommerz
    const data = {
      total_amount: Number(payment.amount),
      currency: payment.currency || "BDT",
      tran_id: payment.id,
      success_url: `${this.config.BASE_URL}/payments/sslcommerz/success`,
      fail_url: `${this.config.BASE_URL}/payments/sslcommerz/fail`,
      cancel_url: `${this.config.BASE_URL}/payments/sslcommerz/cancel`,
      ipn_url: `${this.config.BASE_URL}/payments/sslcommerz/ipn`,
      cus_name: payment.customerName || "Customer",
      cus_email: payment.customerEmail || "customer@example.com",
      cus_add1: "Dhaka, Bangladesh",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: payment.customerPhone || "01700000000",
      product_name: `Hotel Booking - ${payment.booking?.hotel?.name || "Hotel"}`,
      product_category: "Hotel Booking",
      product_profile: "general",
      shipping_method: "NO",
    };

    this.logger.log(`SSLCommerz Payment Data: ${JSON.stringify(data)}`);

    if (!data.total_amount || data.total_amount <= 0) {
      throw new BadRequestException("Invalid payment amount");
    }

    if (!data.cus_name || !data.cus_email) {
      throw new BadRequestException("Customer name and email are required");
    }

    // Update payment status to PROCESSING
    await this.database.client.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.PROCESSING, gatewayName: "SSLCommerz" },
    });

    this.logger.log("Payment status updated to PROCESSING");

    // Initiate payment
    const apiResponse = await this.sslcz.init(data);

    this.logger.log(`SSLCommerz API Response: ${JSON.stringify(apiResponse)}`);

    if (apiResponse?.status === "SUCCESS") {
      return {
        status: "success",
        data: apiResponse,
        gatewayPageURL: apiResponse.GatewayPageURL,
        sessionkey: apiResponse.sessionkey,
      };
    } else {
      // Revert status back to PENDING
      await this.database.client.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.PENDING },
      });
      throw new BadRequestException(
        `SSLCommerz Error: ${apiResponse?.failedreason || apiResponse?.status || "Unknown error"}`,
      );
    }
  }

  async validatePayment(postData: any) {
    if (!this.sslcz)
      throw new BadRequestException("SSLCommerz not initialized");

    const validation = await this.sslcz.validate(postData);
    this.logger.log(
      `SSLCommerz Validation Response: ${JSON.stringify(validation)}`,
    );
    return validation;
  }

  async handleSuccess(postData: any) {
    const validation = await this.validatePayment(postData);

    if (validation.status === "VALID") {
      const updatedPayment = await this.database.client.payment.update({
        where: { id: postData.tran_id },
        data: {
          status: PaymentStatus.SUCCESS,
          transactionId: postData.bank_tran_id,
          gatewayReference: postData.val_id,
          paidAt: new Date(),
        },
        include: { booking: true },
      });

      await this.database.client.booking.update({
        where: { id: updatedPayment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });

      return {
        status: "success",
        message: "Payment completed successfully",
        payment: updatedPayment,
      };
    } else {
      throw new BadRequestException("Payment validation failed");
    }
  }

  async handleFail(postData: any) {
    await this.database.client.payment.update({
      where: { id: postData.tran_id },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: postData.error || "Payment failed",
      },
    });

    return {
      status: "failed",
      message: "Payment failed",
      error: postData.error,
    };
  }

  async handleCancel(postData: any) {
    await this.database.client.payment.update({
      where: { id: postData.tran_id },
      data: {
        status: PaymentStatus.CANCELLED,
        failureReason: "Payment cancelled by user",
      },
    });

    return {
      status: "cancelled",
      message: "Payment cancelled",
    };
  }
}

export default SSLCommerzService;

// Backdated

// const SSLCommerzPayment = require("sslcommerz-lts");
// const { BadRequestError } = require("../utils/errors"); // your custom error or use built-in Error
// const { PaymentStatus, BookingStatus } = require("@prisma/client");

// class SSLCommerzService {
//   /**
//    *
//    * @param {Object} config - config object or env vars
//    * @param {Object} databaseService - database abstraction
//    */
//   constructor(config, databaseService, logger = console) {
//     this.config = config;
//     this.database = databaseService;
//     this.logger = logger;

//     try {
//       const store_id = config.SSLC_STORE_ID || "coxsb688f54556664e";
//       const store_passwd = config.SSLC_STORE_PASSWORD || "coxsb688f54556664e@ssl";
//       const is_live = config.SSLC_IS_LIVE === "true" || false;

//       this.logger.log(`Initializing SSLCommerz with Store ID: ${store_id}`);

//       this.sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

//       this.logger.log("SSLCommerz initialized successfully");
//     } catch (error) {
//       this.logger.error(`SSLCommerz initialization failed: ${error.message}`);
//       throw error;
//     }
//   }

//   async initiatePayment(paymentId) {
//     this.logger.log(`Initiating payment for ID: ${paymentId}`);

//     if (!this.sslcz) throw new BadRequestError("SSLCommerz not initialized");

//     const payment = await this.database.payment.findUnique({
//       where: { id: paymentId },
//       include: {
//         booking: {
//           include: { hotel: true, roomType: true, user: true },
//         },
//       },
//     });

//     if (!payment) {
//       this.logger.error(`Payment not found: ${paymentId}`);
//       throw new BadRequestError("Payment not found");
//     }

//     if (payment.status !== PaymentStatus.PENDING) {
//       this.logger.error(`Payment status not pending: ${payment.status}`);
//       throw new BadRequestError(
//         `Payment is not in pending status. Current status: ${payment.status}`
//       );
//     }

//     // Build payment data object for SSLCommerz
//     const data = {
//       total_amount: Number(payment.amount),
//       currency: payment.currency || "BDT",
//       tran_id: payment.id,
//       success_url: `${this.config.BASE_URL}/payments/sslcommerz/success`,
//       fail_url: `${this.config.BASE_URL}/payments/sslcommerz/fail`,
//       cancel_url: `${this.config.BASE_URL}/payments/sslcommerz/cancel`,
//       ipn_url: `${this.config.BASE_URL}/payments/sslcommerz/ipn`,
//       cus_name: payment.customerName || "Customer",
//       cus_email: payment.customerEmail || "customer@example.com",
//       cus_add1: "Dhaka, Bangladesh",
//       cus_city: "Dhaka",
//       cus_country: "Bangladesh",
//       cus_phone: payment.customerPhone || "01700000000",
//       product_name: `Hotel Booking - ${payment.booking?.hotel?.name || "Hotel"}`,
//       product_category: "Hotel Booking",
//       product_profile: "general",
//       shipping_method: "NO",
//     };

//     this.logger.log(`SSLCommerz Payment Data: ${JSON.stringify(data)}`);

//     if (!data.total_amount || data.total_amount <= 0) {
//       throw new BadRequestError("Invalid payment amount");
//     }

//     if (!data.cus_name || !data.cus_email) {
//       throw new BadRequestError("Customer name and email are required");
//     }

//     // Update payment status to PROCESSING
//     await this.database.payment.update({
//       where: { id: paymentId },
//       data: { status: PaymentStatus.PROCESSING, gatewayName: "SSLCommerz" },
//     });

//     this.logger.log("Payment status updated to PROCESSING");

//     // Initiate payment
//     const apiResponse = await this.sslcz.init(data);

//     this.logger.log(`SSLCommerz API Response: ${JSON.stringify(apiResponse)}`);

//     if (apiResponse?.status === "SUCCESS") {
//       return {
//         status: "success",
//         data: apiResponse,
//         gatewayPageURL: apiResponse.GatewayPageURL,
//         sessionkey: apiResponse.sessionkey,
//       };
//     } else {
//       // Revert status back to PENDING
//       await this.database.payment.update({
//         where: { id: paymentId },
//         data: { status: PaymentStatus.PENDING },
//       });
//       throw new BadRequestError(
//         `SSLCommerz Error: ${apiResponse?.failedreason || apiResponse?.status || "Unknown error"}`
//       );
//     }
//   }

//   async validatePayment(postData) {
//     if (!this.sslcz) throw new BadRequestError("SSLCommerz not initialized");

//     const validation = await this.sslcz.validate(postData);
//     this.logger.log(`SSLCommerz Validation Response: ${JSON.stringify(validation)}`);
//     return validation;
//   }

//   async handleSuccess(postData) {
//     const validation = await this.validatePayment(postData);

//     if (validation.status === "VALID") {
//       const updatedPayment = await this.database.payment.update({
//         where: { id: postData.tran_id },
//         data: {
//           status: PaymentStatus.COMPLETED,
//           transactionId: postData.bank_tran_id,
//           gatewayReference: postData.val_id,
//           paidAt: new Date(),
//         },
//         include: { booking: true },
//       });

//       await this.database.booking.update({
//         where: { id: updatedPayment.bookingId },
//         data: { status: BookingStatus.CONFIRMED },
//       });

//       return {
//         status: "success",
//         message: "Payment completed successfully",
//         payment: updatedPayment,
//       };
//     } else {
//       throw new BadRequestError("Payment validation failed");
//     }
//   }

//   async handleFail(postData) {
//     await this.database.payment.update({
//       where: { id: postData.tran_id },
//       data: {
//         status: PaymentStatus.FAILED,
//         failureReason: postData.error || "Payment failed",
//       },
//     });

//     return {
//       status: "failed",
//       message: "Payment failed",
//       error: postData.error,
//     };
//   }

//   async handleCancel(postData) {
//     await this.database.payment.update({
//       where: { id: postData.tran_id },
//       data: {
//         status: PaymentStatus.CANCELLED,
//         failureReason: "Payment cancelled by user",
//       },
//     });

//     return {
//       status: "cancelled",
//       message: "Payment cancelled",
//     };
//   }
// }

// export default SSLCommerzService;
