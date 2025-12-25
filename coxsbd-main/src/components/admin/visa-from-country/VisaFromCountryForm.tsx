"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";

type VisaFromCountryFormState = {
  country: string;
  nicename: string;
  iso: string;
  status: boolean;
};

type VisaFromCountryFormProps = {
  formState: VisaFromCountryFormState;
  onChange: (field: keyof VisaFromCountryFormState, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
};

const visaFromCountrySchema = z.object({
  country: z.string().min(1, "Country is required"),
  nicename: z.string().min(1, "Nicename is required"),
  iso: z.string().min(1, "ISO code is required"),
  status: z.boolean(),
});

type Errors = Partial<Record<keyof VisaFromCountryFormState, string>>;

export default function VisaFromCountryForm({
  formState,
  onChange,
  onSubmit,
}: VisaFromCountryFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = visaFromCountrySchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof VisaFromCountryFormState;
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
      id="visa-from-country-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg"
    >
      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Country</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Enter country name"
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Nicename</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.nicename}
            onChange={(e) => onChange("nicename", e.target.value)}
            placeholder="Enter nicename"
          />
          {errors.nicename && (
            <p className="mt-1 text-xs text-red-600">{errors.nicename}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">ISO Code</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.iso}
            onChange={(e) => onChange("iso", e.target.value.toUpperCase())}
            placeholder="Enter ISO code (e.g., BD)"
            maxLength={3}
          />
          {errors.iso && (
            <p className="mt-1 text-xs text-red-600">{errors.iso}</p>
          )}
        </div>
      </div>

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
    </form>
  );
}
