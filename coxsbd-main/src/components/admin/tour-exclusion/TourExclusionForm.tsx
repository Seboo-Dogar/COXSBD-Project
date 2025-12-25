"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";

type TourExclusionFormState = {
  name: string;
};

type TourExclusionFormProps = {
  formState: TourExclusionFormState;
  onChange: (field: keyof TourExclusionFormState, value: string) => void;
  onSubmit: (e: FormEvent) => void;
};

const tourExclusionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

type Errors = Partial<Record<keyof TourExclusionFormState, string>>;

export default function TourExclusionForm({
  formState,
  onChange,
  onSubmit,
}: TourExclusionFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = tourExclusionSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TourExclusionFormState;
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
      id="tour-exclusion-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg"
    >
      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Name</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter tour exclusion name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>
      </div>
    </form>
  );
}
