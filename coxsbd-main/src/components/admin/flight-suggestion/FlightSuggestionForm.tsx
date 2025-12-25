"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { SuggestionType } from "@/types/FlightSuggestion";
import { useActiveAirports } from "@/hooks/useAirports";
import SearchableSelect from "../../common/SearchableSelect";

type FlightSuggestionFormState = {
  type: SuggestionType;
  cityAirport: string;
  order: number;
  status: boolean;
};

type FlightSuggestionFormProps = {
  formState: FlightSuggestionFormState;
  onChange: (field: keyof FlightSuggestionFormState, value: string | boolean | number) => void;
  onSubmit: (e: FormEvent) => void;
};

const flightSuggestionSchema = z.object({
  type: z.enum(["FROM_DESTINATION", "TO_DESTINATION"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
  cityAirport: z.string().min(1, "City/Airport is required"),
  order: z.coerce.number().min(0, "Order must be 0 or greater"),
  status: z.boolean(),
});

type Errors = Partial<Record<keyof FlightSuggestionFormState, string>>;

export default function FlightSuggestionForm({
  formState,
  onChange,
  onSubmit,
}: FlightSuggestionFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});
  const { data: airportsData } = useActiveAirports({ limit: 1000 });

  const airports = airportsData?.airports ?? [];

  // Create options for cityAirport searchable select
  const cityAirportOptions = airports.map((airport) => ({
    id: `${airport.airport} (${airport.code}) - ${airport.city}, ${airport.country}`,
    label: `${airport.airport} (${airport.code}) - ${airport.city}, ${airport.country}`,
  }));

  // For type dropdown
  const typeOptions = [
    { value: "FROM_DESTINATION", label: "From Destination" },
    { value: "TO_DESTINATION", label: "To Destination" },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = flightSuggestionSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FlightSuggestionFormState;
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
      id="flight-suggestion-form"
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
        <label className="w-32 text-sm font-medium text-gray-700">Type</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.type}
            onChange={(e) => onChange("type", e.target.value as SuggestionType)}
          >
            <option value="">Select type</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">City/Airport</label>
        <SearchableSelect
          value={formState.cityAirport}
          options={cityAirportOptions}
          placeholder="Search city/airport..."
          onChange={(value) => onChange("cityAirport", value)}
          error={errors.cityAirport}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Order</label>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            step="1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.order}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseInt(value, 10);
              onChange("order", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.order && (
            <p className="mt-1 text-xs text-red-600">{errors.order}</p>
          )}
        </div>
      </div>
    </form>
  );
}
