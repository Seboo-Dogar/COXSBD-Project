/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/payment/success.tsx or app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentDetails {
  bookingId: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  hotelName?: string;
  roomType?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    // Get data from URL params
    const details: PaymentDetails = {
      bookingId: searchParams.get("booking_id") || "",
      paymentId: searchParams.get("payment_id") || "",
      transactionId: searchParams.get("transaction_id") || "",
      amount: parseInt(searchParams.get("amount") || "0"),
    };

    // Get additional details from localStorage if available
    const storedDetails = localStorage.getItem("bookingDetails");
    if (storedDetails) {
      const stored = JSON.parse(storedDetails);
      setBookingDetails(stored);
    }

    setPaymentDetails(details);

    // Clean up localStorage after success
    setTimeout(() => {
      localStorage.removeItem("currentBookingId");
      localStorage.removeItem("currentPaymentId");
      localStorage.removeItem("bookingDetails");
    }, 5000);
  }, [searchParams]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Implement PDF generation or redirect to receipt endpoint
    window.open(`/booking/${paymentDetails?.bookingId}/receipt`, "_blank");
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            Payment Successful! 🎉
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Your hotel booking has been confirmed
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Booking ID
                  </label>
                  <p className="text-lg font-mono text-gray-800">
                    {paymentDetails.bookingId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Payment ID
                  </label>
                  <p className="text-lg font-mono text-gray-800">
                    {paymentDetails.paymentId}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </label>
                  <p className="text-lg font-mono text-gray-800">
                    {paymentDetails.transactionId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Amount Paid
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{paymentDetails.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Booking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Hotel
                    </label>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingDetails.hotelName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Room Type
                    </label>
                    <p className="text-lg text-gray-800">
                      {bookingDetails.roomType}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Guest Name
                    </label>
                    <p className="text-lg text-gray-800">
                      {bookingDetails.guestName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Check-in / Check-out
                    </label>
                    <p className="text-lg text-gray-800">
                      {new Date(bookingDetails.checkIn).toLocaleDateString()} -{" "}
                      {new Date(bookingDetails.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={() => (window.location.href = "/")}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={handlePrintReceipt}
              variant="outline"
              className="flex-1"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-6 border-t">
            <p className="text-gray-600">
              📧 A confirmation email has been sent to your registered email
              address.
            </p>
            <p className="text-gray-600 mt-2">
              Thank you for choosing CoxsBD! We hope you enjoy your stay. 🏨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
