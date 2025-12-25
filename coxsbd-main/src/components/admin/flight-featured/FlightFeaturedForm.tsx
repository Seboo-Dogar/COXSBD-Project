"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { useActiveAirlines } from "@/hooks/useAirlines";
import { useActiveAirports } from "@/hooks/useAirports";
import SearchableSelect from "../../common/SearchableSelect";

type FlightFeaturedFormState = {
  airlineId: string;
  fromAirportId: string;
  toAirportId: string;
  price: number;
  status: boolean;
};

type FlightFeaturedFormProps = {
  formState: FlightFeaturedFormState;
  onChange: (field: keyof FlightFeaturedFormState, value: string | boolean | number) => void;
  onSubmit: (e: FormEvent) => void;
};

const flightFeaturedSchema = z.object({
  airlineId: z.string().min(1, "Airline is required"),
  fromAirportId: z.string().min(1, "From airport is required"),
  toAirportId: z.string().min(1, "To airport is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  status: z.boolean(),
});

type Errors = Partial<Record<keyof FlightFeaturedFormState, string>>;

export default function FlightFeaturedForm({
  formState,
  onChange,
  onSubmit,
}: FlightFeaturedFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});
  const { data: airlinesData } = useActiveAirlines({ limit: 1000 });
  const { data: airportsData } = useActiveAirports({ limit: 1000 });

  const airlines = airlinesData?.airlines ?? [];
  const airports = airportsData?.airports ?? [];

  const airlineOptions = airlines.map((airline) => ({
    id: airline.id,
    label: `${airline.name} (${airline.code})`,
  }));

  const airportOptions = airports.map((airport) => ({
    id: airport.id,
    label: `${airport.airport} (${airport.code}) - ${airport.city}, ${airport.country}`,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = flightFeaturedSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FlightFeaturedFormState;
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
      id="flight-featured-form"
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
        <label className="w-32 text-sm font-medium text-gray-700">Price</label>
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2 text-sm"
            value={typeof formState.price === "number" && formState.price === 0 ? "" : formState.price}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("price", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>
      </div>
    </form>
  );
}
