import { NextResponse } from "next/server";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Use axiosConfig to fetch hotel data from external API
    const response = await axiosConfig().get(`/hotels/${params.id}`);
    const hotel = response.data;

    const apiResponse = NextResponse.json(hotel);

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
    console.error("Error fetching hotel:", error);

    // Use handleAxiosError for consistent error handling
    const errorMessage = handleAxiosError(error);

    // Check if it's a 404 error (hotel not found)
    const isNotFound =
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404;

    const statusCode = isNotFound ? 404 : 500;
    const errorResponse = NextResponse.json(
      {
        error: isNotFound ? "Hotel not found" : "Failed to fetch hotel",
        message: errorMessage,
      },
      { status: statusCode },
    );

    // Add CORS headers to error response too
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
