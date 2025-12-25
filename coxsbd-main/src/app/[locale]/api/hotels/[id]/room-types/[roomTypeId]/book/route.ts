import { NextResponse } from "next/server";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; roomTypeId: string }> },
) {
  try {
    const body = await request.json();
    const { id, roomTypeId } = await params;

    // Transform dates to proper format for backend
    const transformedBody = {
      ...body,
      checkIn: new Date(body.checkIn).toISOString(),
      checkOut: new Date(body.checkOut).toISOString(),
    };

    const bookingUrl = `/hotels/${id}/room-types/${roomTypeId}/book`;
    console.log("🔍 Booking API Debug:");
    console.log("Hotel ID:", id);
    console.log("Room Type ID:", roomTypeId);
    console.log("Original Body:", body);
    console.log("Transformed Body:", transformedBody);
    console.log("Booking URL:", bookingUrl);

    // Use axiosConfig to make booking request to external API
    const response = await axiosConfig().post(bookingUrl, transformedBody);

    const bookingData = response.data;

    const apiResponse = NextResponse.json(bookingData);

    // Add CORS headers
    apiResponse.headers.set("Access-Control-Allow-Origin", "*");
    apiResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    apiResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    return apiResponse;
  } catch (error) {
    console.error("❌ Booking API Error Details:");
    console.error("Error type:", typeof error);
    console.error("Error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown; statusText?: string };
      };
      console.error("Response Status:", axiosError.response?.status);
      console.error("Response Data:", axiosError.response?.data);
      console.error("Status Text:", axiosError.response?.statusText);
    }

    // Use handleAxiosError for consistent error handling
    const errorMessage = handleAxiosError(error);

    // Check if it's a specific booking error
    const isConflict =
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 409;

    const statusCode = isConflict ? 409 : 500;
    const errorResponse = NextResponse.json(
      {
        error: isConflict
          ? "Room not available for selected dates"
          : "Failed to book room",
        message: errorMessage,
        details:
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: unknown } }).response?.data
            : null,
      },
      { status: statusCode },
    );

    // Add CORS headers to error response too
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");

    return errorResponse;
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
