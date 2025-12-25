"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";

type AirportFormState = {
  code: string;
  airport: string;
  city: string;
  country: string;
  status: boolean;
};

type AirportFormProps = {
  formState: AirportFormState;
  onChange: (field: keyof AirportFormState, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
};

const airportSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(10, "Code must be at most 10 characters"),
  airport: z
    .string()
    .min(2, "Airport name must be at least 2 characters")
    .max(100, "Airport name must be at most 100 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be at most 100 characters"),
  status: z.boolean(),
});

type Errors = Partial<Record<keyof AirportFormState, string>>;

export default function AirportForm({
  formState,
  onChange,
  onSubmit,
}: AirportFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = airportSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof AirportFormState;
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
      id="airport-form"
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
        <label className="w-32 text-sm font-medium text-gray-700">Code</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.code}
            onChange={(e) => onChange("code", e.target.value)}
          />
          {errors.code && (
            <p className="mt-1 text-xs text-red-600">{errors.code}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Airport</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.airport}
            onChange={(e) => onChange("airport", e.target.value)}
          />
          {errors.airport && (
            <p className="mt-1 text-xs text-red-600">{errors.airport}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">City</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Country</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.country}
            onChange={(e) => onChange("country", e.target.value)}
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-600">{errors.country}</p>
          )}
        </div>
      </div>
    </form>
  );
}
