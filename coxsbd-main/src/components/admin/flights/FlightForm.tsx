"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { useActiveAirlines } from "@/hooks/useAirlines";
import { useActiveAirports } from "@/hooks/useAirports";
import { useMerchantUsers } from "@/hooks/useMerchantUsers";
import SearchableSelect from "../../common/SearchableSelect";
import { FlightType } from "@/types/Flight";

type FlightFormState = {
  userId: string;
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  adultSeatPrice: number;
  childPrice: number;
  infantPrice: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  baggage: string;
  cabinBaggage: string;
  type: FlightType | "";
  status: boolean;
  refundable: boolean;
  offer: boolean;
};

type FlightFormProps = {
  formState: FlightFormState;
  onChange: (field: keyof FlightFormState, value: string | boolean | number) => void;
  onSubmit: (e: FormEvent) => void;
};

const flightSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  airlineId: z.string().min(1, "Airline is required"),
  fromAirportId: z.string().min(1, "From airport is required"),
  toAirportId: z.string().min(1, "To airport is required"),
  adultSeatPrice: z.coerce.number().positive("Adult seat price must be greater than 0"),
  childPrice: z.coerce.number().min(0, "Child price must be 0 or greater"),
  infantPrice: z.coerce.number().min(0, "Infant price must be 0 or greater"),
  duration: z.string().min(1, "Duration is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  baggage: z.string().min(1, "Baggage is required"),
  cabinBaggage: z.string().min(1, "Cabin baggage is required"),
  type: z.union([z.enum(["ECONOMY", "ECONOMY_PREMIUM", "BUSINESS", "FIRST"]), z.literal("")]),
  status: z.boolean(),
  refundable: z.boolean(),
  offer: z.boolean(),
});

type Errors = Partial<Record<keyof FlightFormState, string>>;

export default function FlightForm({
  formState,
  onChange,
  onSubmit,
}: FlightFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});
  const { data: airlinesData } = useActiveAirlines({ limit: 1000 });
  const { data: airportsData } = useActiveAirports({ limit: 1000 });
  const { data: merchantUsersData } = useMerchantUsers({ limit: 1000 });

  const airlines = airlinesData?.airlines ?? [];
  const airports = airportsData?.airports ?? [];
  const merchantUsers = merchantUsersData?.users ?? [];

  const airlineOptions = airlines.map((airline) => ({
    id: airline.id,
    label: `${airline.name} (${airline.code})`,
  }));

  const airportOptions = airports.map((airport) => ({
    id: airport.id,
    label: `${airport.airport} (${airport.code}) - ${airport.city}, ${airport.country}`,
  }));

  const merchantUserOptions = merchantUsers.map((user) => ({
    id: user.id,
    label: `${user.email}`,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = flightSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FlightFormState;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(e);
  };

  return (
    <form
      id="flight-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg"
    >
      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Status</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.status ? "enable" : "disable"}
            onChange={(e) => onChange("status", e.target.value === "enable")}
          >
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">User</label>
        <SearchableSelect
          value={formState.userId}
          options={merchantUserOptions}
          placeholder="Search merchant user..."
          onChange={(value) => onChange("userId", value)}
          error={errors.userId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Airline</label>
        <SearchableSelect
          value={formState.airlineId}
          options={airlineOptions}
          placeholder="Search airline..."
          onChange={(value) => onChange("airlineId", value)}
          error={errors.airlineId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">From Airport</label>
        <SearchableSelect
          value={formState.fromAirportId}
          options={airportOptions}
          placeholder="Search airport..."
          onChange={(value) => onChange("fromAirportId", value)}
          error={errors.fromAirportId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">To Airport</label>
        <SearchableSelect
          value={formState.toAirportId}
          options={airportOptions}
          placeholder="Search airport..."
          onChange={(value) => onChange("toAirportId", value)}
          error={errors.toAirportId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Adult Price</label>
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.adultSeatPrice || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("adultSeatPrice", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.adultSeatPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.adultSeatPrice}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Child Price</label>
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.childPrice || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("childPrice", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.childPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.childPrice}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Infant Price</label>
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.infantPrice || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("infantPrice", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.infantPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.infantPrice}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Duration</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            placeholder="e.g., 2h 30m"
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-red-600">{errors.duration}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Departure Time</label>
        <div className="flex-1">
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2 text-sm"
            value={
              formState.departureTime
                ? new Date(formState.departureTime).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                // Convert local datetime to ISO string
                const localDate = new Date(value);
                onChange("departureTime", localDate.toISOString());
              } else {
                onChange("departureTime", "");
              }
            }}
          />
          {errors.departureTime && (
            <p className="mt-1 text-xs text-red-600">{errors.departureTime}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Arrival Time</label>
        <div className="flex-1">
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2 text-sm"
            value={
              formState.arrivalTime
                ? new Date(formState.arrivalTime).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                // Convert local datetime to ISO string
                const localDate = new Date(value);
                onChange("arrivalTime", localDate.toISOString());
              } else {
                onChange("arrivalTime", "");
              }
            }}
          />
          {errors.arrivalTime && (
            <p className="mt-1 text-xs text-red-600">{errors.arrivalTime}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Baggage</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.baggage}
            onChange={(e) => onChange("baggage", e.target.value)}
            placeholder="e.g., 20kg"
          />
          {errors.baggage && (
            <p className="mt-1 text-xs text-red-600">{errors.baggage}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Cabin Baggage</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.cabinBaggage}
            onChange={(e) => onChange("cabinBaggage", e.target.value)}
            placeholder="e.g., 7kg"
          />
          {errors.cabinBaggage && (
            <p className="mt-1 text-xs text-red-600">{errors.cabinBaggage}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Type</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.type || ""}
            onChange={(e) => onChange("type", e.target.value as FlightType | "")}
          >
            <option value="">Select type</option>
            <option value="ECONOMY">Economy</option>
            <option value="ECONOMY_PREMIUM">Economy Premium</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Refundable</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.refundable ? "yes" : "no"}
            onChange={(e) => onChange("refundable", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Offer</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.offer ? "yes" : "no"}
            onChange={(e) => onChange("offer", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>
    </form>
  );
}
