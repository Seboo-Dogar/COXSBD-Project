import { NextResponse } from "next/server";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get("skip") || "0";
    const take = searchParams.get("take") || "10";
    const location = searchParams.get("location") || "";
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";

    // Build query string for external API
    const queryParams = new URLSearchParams({
      skip,
      take,
      ...(location && { location }),
      ...(checkIn && { checkIn }),
      ...(checkOut && { checkOut }),
    });

    // Use axiosConfig to fetch data from external API
    const response = await axiosConfig().get(
      `/hotels?${queryParams.toString()}`,
    );
    const hotels = response.data;

    const apiResponse = NextResponse.json(hotels);

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
    console.error("Error fetching hotels:", error);

    // Use handleAxiosError for better error handling
    const errorMessage = handleAxiosError(error);

    // Return error response
    const errorResponse = NextResponse.json(
      { error: "Failed to fetch hotels", message: errorMessage },
      { status: 500 },
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
