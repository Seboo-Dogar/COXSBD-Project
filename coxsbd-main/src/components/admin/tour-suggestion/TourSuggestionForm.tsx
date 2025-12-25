"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";

type TourSuggestionFormState = {
  city: string;
  order: number;
  status: boolean;
};

type TourSuggestionFormProps = {
  formState: TourSuggestionFormState;
  onChange: (field: keyof TourSuggestionFormState, value: string | boolean | number) => void;
  onSubmit: (e: FormEvent) => void;
};

const tourSuggestionSchema = z.object({
  city: z.string().min(1, "City is required"),
  order: z.coerce.number().min(0, "Order must be 0 or greater"),
  status: z.boolean(),
});

type Errors = Partial<Record<keyof TourSuggestionFormState, string>>;

export default function TourSuggestionForm({
  formState,
  onChange,
  onSubmit,
}: TourSuggestionFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = tourSuggestionSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TourSuggestionFormState;
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
      id="tour-suggestion-form"
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
        <label className="w-32 text-sm font-medium text-gray-700">City</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Enter city name"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>
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
