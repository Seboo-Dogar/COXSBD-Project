/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Calendar,
  X,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import axiosConfig from "@/utils/axiosConfig";
import Cookies from "js-cookie";

interface Room {
  id: string;
  type: string;
  description: string;
  price: string;
  capacity: number;
  currency: string;
  amenities: string[];
  hotelId: string;
}

interface BookingModalProps {
  room: Room;
  hotelName: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingData: unknown) => void;
}

interface BookingForm {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  numberOfGuests: number;
  numberOfRooms: number;
  specialRequests: string;
}

// Enhanced Payment API Service with better error handling
const paymentAPI = {
  createPayment: async (paymentData: {
    bookingId: string;
    amount: number;
    currency: string;
    method: string;
    gatewayName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }) => {
    try {
      const response = await axiosConfig().post("/payments", paymentData);
      return response.data;
    } catch (error: any) {
      console.error(
        "Payment creation failed:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to create payment",
      );
    }
  },

  initiateSSLCommerz: async (paymentId: string) => {
    try {
      const response = await axiosConfig().post(
        `/payments/${paymentId}/initiate-sslcommerz`,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "SSLCommerz initiation failed:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to initiate payment gateway",
      );
    }
  },

  checkPaymentStatus: async (paymentId: string) => {
    try {
      const response = await axiosConfig().get(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        "Payment status check failed:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to check payment status",
      );
    }
  },
};

// Room availability check
const checkRoomAvailability = async (
  hotelId: string,
  roomId: string,
  checkIn: string,
  checkOut: string,
  numberOfRooms: number,
) => {
  try {
    const response = await axiosConfig().get(
      `/hotels/${hotelId}/room-types/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}&numberOfRooms=${numberOfRooms}`,
    );
    return response.data.available;
  } catch (error) {
    console.warn("Availability check failed, proceeding with booking attempt");
    return true; // Fallback to allow booking attempt
  }
};

export default function BookingModal({
  room,
  hotelName,
  isOpen,
  onClose,
  onBookingSuccess,
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingForm>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkInDate: undefined,
    checkOutDate: undefined,
    numberOfGuests: 1,
    numberOfRooms: 1,
    specialRequests: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "booking" | "payment" | "processing" | "success"
  >("booking");
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleInputChange = (
    field: keyof BookingForm,
    value: string | number | Date | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const timeDiff =
        formData.checkOutDate.getTime() - formData.checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = parseInt(room.price);
    return nights * roomPrice * formData.numberOfRooms;
  };

  const validateForm = () => {
    if (!formData.guestName.trim()) return "Guest name is required";
    if (!formData.guestEmail.trim()) return "Email is required";
    if (!formData.guestPhone.trim()) return "Phone number is required";
    if (!formData.checkInDate) return "Check-in date is required";
    if (!formData.checkOutDate) return "Check-out date is required";
    if (formData.checkInDate >= formData.checkOutDate)
      return "Check-out date must be after check-in date";
    if (formData.numberOfGuests < 1)
      return "Number of guests must be at least 1";
    if (formData.numberOfGuests > room.capacity)
      return `Maximum ${room.capacity} guests allowed for this room`;
    if (formData.numberOfRooms < 1) return "Number of rooms must be at least 1";
    return null;
  };

  // Process complete booking and payment flow
  const processBookingAndPayment = async (bookingResponse: any) => {
    try {
      setCurrentStep("payment");
      console.log("🏨 Booking successful, creating payment...");

      // Step 1: Create Payment
      const paymentRequestData = {
        bookingId: bookingResponse.id,
        amount: calculateTotal(),
        currency: "BDT",
        method: "CREDIT_CARD",
        gatewayName: "SSLCommerz",
        customerName: formData.guestName,
        customerEmail: formData.guestEmail,
        customerPhone: formData.guestPhone,
      };

      console.log("💳 Creating payment:", paymentRequestData);
      const payment = await paymentAPI.createPayment(paymentRequestData);
      console.log("✅ Payment created:", payment.id);
      setPaymentData(payment);

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Initiate SSLCommerz
      console.log("🔄 Initiating SSLCommerz payment...");
      const sslCommerzResponse = await paymentAPI.initiateSSLCommerz(
        payment.id,
      );
      console.log("🚀 SSLCommerz response:", sslCommerzResponse);

      if (
        sslCommerzResponse.status === "success" &&
        sslCommerzResponse.gatewayPageURL
      ) {
        // Store payment info in localStorage for reference
        localStorage.setItem("currentBookingId", bookingResponse.id);
        localStorage.setItem("currentPaymentId", payment.id);
        localStorage.setItem(
          "bookingDetails",
          JSON.stringify({
            hotelName,
            roomType: room.type,
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            totalAmount: calculateTotal(),
            guestName: formData.guestName,
            bookingId: bookingResponse.id,
            paymentId: payment.id,
          }),
        );

        console.log("🔗 Redirecting to SSLCommerz...");

        // Show success message before redirect
        setCurrentStep("success");

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = sslCommerzResponse.gatewayPageURL;
        }, 2000);
      } else {
        throw new Error(
          `Payment gateway error: ${sslCommerzResponse.message || "Invalid response from payment gateway"}`,
        );
      }
    } catch (paymentError: any) {
      console.error("💥 Payment process failed:", paymentError);
      setError(
        `Booking successful but payment failed: ${paymentError.message}`,
      );
      setCurrentStep("booking");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentStep("processing");

    try {
      // Optional: Check room availability first
      console.log("🔍 Checking room availability...");
      const isAvailable = await checkRoomAvailability(
        room.hotelId,
        room.id,
        formData.checkInDate!.toISOString(),
        formData.checkOutDate!.toISOString(),
        formData.numberOfRooms,
      );

      if (!isAvailable) {
        setError(
          "Sorry, the requested rooms are not available for your selected dates.",
        );
        setCurrentStep("booking");
        setIsLoading(false);
        return;
      }

      const userId = Cookies.get("userId") || "guest-user";
      const bookingRequestData = {
        userId: userId,
        checkIn: formData.checkInDate?.toISOString(),
        checkOut: formData.checkOutDate?.toISOString(),
        numberOfRooms: formData.numberOfRooms,
      };

      console.log("🚀 Frontend booking request:", bookingRequestData);

      // Step 1: Book the hotel room
      const bookingResponse = await axiosConfig().post(
        `/hotels/${room.hotelId}/room-types/${room.id}/book`,
        bookingRequestData,
      );

      console.log("📦 Booking response:", bookingResponse.data);
      setBookingData(bookingResponse.data);

      // Step 2: Process payment automatically
      await processBookingAndPayment(bookingResponse.data);
    } catch (err: any) {
      console.error("❌ Booking error:", err);

      // Enhanced error handling
      let errorMessage = "Failed to book room. Please try again.";

      if (err.response) {
        const { status, data } = err.response;
        console.error("Response status:", status);
        console.error("Response data:", data);

        switch (status) {
          case 409:
            errorMessage = `Room not available: ${data.message || "Please select different dates or room type"}`;
            break;
          case 400:
            errorMessage = `Invalid request: ${data.message || "Please check your booking details"}`;
            break;
          case 404:
            errorMessage = "Hotel or room type not found";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = data.message || errorMessage;
        }
      }

      setError(errorMessage);
      setCurrentStep("booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentLater = () => {
    // If user wants to pay later, just close modal and show success
    onBookingSuccess(bookingData);
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setCurrentStep("booking");
    setError(null);
    setBookingData(null);
    setPaymentData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">
              {currentStep === "booking" && "Book Your Room"}
              {currentStep === "payment" && "Payment Processing"}
              {currentStep === "processing" && "Processing..."}
              {currentStep === "success" && "Booking Complete!"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={20} />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "booking" ? "text-blue-600" : "text-green-600"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "booking" ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  {currentStep === "booking" ? "1" : "✓"}
                </div>
                <span>Booking</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === "payment" || currentStep === "success"
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === "payment" || currentStep === "success"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {currentStep === "success" ? "✓" : <CreditCard size={16} />}
                </div>
                <span>Payment</span>
              </div>
            </div>

            {/* Room Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{room.type}</h3>
              <p className="text-gray-600">{hotelName}</p>
              <p className="text-gray-600 text-sm mt-1">{room.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-red-600">
                  ৳{parseInt(room.price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">per night</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Processing State */}
            {currentStep === "processing" && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Processing your booking and payment...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait, this may take a few moments
                </p>
              </div>
            )}

            {/* Payment State */}
            {currentStep === "payment" && (
              <div className="text-center py-8">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  <h4 className="font-semibold flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Booking Confirmed! 🎉
                  </h4>
                  <p>
                    Your room has been successfully booked. Setting up
                    payment...
                  </p>
                </div>
                <div className="animate-pulse">
                  <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-2" />
                  <p className="text-gray-600">
                    Preparing secure payment gateway...
                  </p>
                </div>
              </div>
            )}

            {/* Success State */}
            {currentStep === "success" && (
              <div className="text-center py-8">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  <h4 className="font-semibold flex items-center justify-center gap-2">
                    <CheckCircle size={24} />
                    Ready for Payment! 🚀
                  </h4>
                  <p className="mt-2">
                    Booking ID: <strong>{bookingData?.id}</strong>
                  </p>
                  <p>
                    Payment ID: <strong>{paymentData?.id}</strong>
                  </p>
                  <p className="mt-2">
                    Redirecting to secure payment gateway...
                  </p>
                </div>
                <div className="animate-bounce">
                  <CreditCard className="mx-auto h-16 w-16 text-green-600 mb-4" />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePaymentLater}
                    className="flex-1"
                  >
                    Pay Later
                  </Button>
                </div>
              </div>
            )}

            {/* Booking Form */}
            {currentStep === "booking" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Guest Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Full Name *</Label>
                    <Input
                      id="guestName"
                      value={formData.guestName}
                      onChange={(e) =>
                        handleInputChange("guestName", e.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) =>
                        handleInputChange("guestEmail", e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestPhone">Phone Number *</Label>
                    <Input
                      id="guestPhone"
                      value={formData.guestPhone}
                      onChange={(e) =>
                        handleInputChange("guestPhone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      min="1"
                      max={room.capacity}
                      value={formData.numberOfGuests}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfGuests",
                          parseInt(e.target.value),
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberOfRooms">Number of Rooms *</Label>
                    <Input
                      id="numberOfRooms"
                      type="number"
                      min="1"
                      value={formData.numberOfRooms}
                      onChange={(e) =>
                        handleInputChange(
                          "numberOfRooms",
                          parseInt(e.target.value),
                        )
                      }
                      required
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.checkInDate
                            ? format(formData.checkInDate, "MMM dd, yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.checkInDate}
                          onSelect={(date) =>
                            handleInputChange("checkInDate", date)
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Check-out Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.checkOutDate
                            ? format(formData.checkOutDate, "MMM dd, yyyy")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.checkOutDate}
                          onSelect={(date) =>
                            handleInputChange("checkOutDate", date)
                          }
                          disabled={(date) =>
                            !formData.checkInDate ||
                            date <= formData.checkInDate
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleInputChange("specialRequests", e.target.value)
                    }
                    placeholder="Any special requests or preferences..."
                    rows={3}
                  />
                </div>

                {/* Booking Summary */}
                {formData.checkInDate && formData.checkOutDate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Room Rate (per night):</span>
                        <span>৳{parseInt(room.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Nights:</span>
                        <span>{calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Guests:</span>
                        <span>{formData.numberOfGuests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Rooms:</span>
                        <span>{formData.numberOfRooms}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total Amount:</span>
                        <span className="text-red-600">
                          ৳{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? "Processing..." : "Book & Pay Now"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
