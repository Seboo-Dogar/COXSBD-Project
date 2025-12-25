"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { useAllVisaFromCountries } from "@/hooks/useVisaFromCountry";
import { useAllVisaToCountries } from "@/hooks/useVisaToCountry";
import SearchableSelect from "../../common/SearchableSelect";
import { VisaStatus } from "@/types/VisaBooking";

type VisaBookingFormState = {
  status: VisaStatus;
  fromCountryId: string;
  toCountryId: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  days: number;
  entryType: string;
  visaType: string;
};

type VisaBookingFormProps = {
  formState: VisaBookingFormState;
  onChange: (field: keyof VisaBookingFormState, value: string | number | VisaStatus) => void;
  onSubmit: (e: FormEvent) => void;
};

const visaBookingSchema = z.object({
  status: z.nativeEnum(VisaStatus),
  fromCountryId: z.string().min(1, "From country is required"),
  toCountryId: z.string().min(1, "To country is required"),
  date: z.string().min(1, "Date is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  days: z.coerce.number().min(1, "Days must be at least 1"),
  entryType: z.string().min(1, "Entry type is required"),
  visaType: z.string().min(1, "Visa type is required"),
});

type Errors = Partial<Record<keyof VisaBookingFormState, string>>;

export default function VisaBookingForm({
  formState,
  onChange,
  onSubmit,
}: VisaBookingFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});
  const { data: fromCountries = [] } = useAllVisaFromCountries();
  const { data: toCountries = [] } = useAllVisaToCountries();

  const fromCountryOptions = fromCountries.map((country) => ({
    id: country.id,
    label: country.country,
  }));

  const toCountryOptions = toCountries.map((country) => ({
    id: country.id,
    label: country.country,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = visaBookingSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof VisaBookingFormState;
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
      id="visa-booking-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl"
    >
      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Status</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.status}
            onChange={(e) => onChange("status", e.target.value as VisaStatus)}
          >
            <option value={VisaStatus.WAITING}>Waiting</option>
            <option value={VisaStatus.PROGRESS}>Progress</option>
            <option value={VisaStatus.DONE}>Done</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">From Country</label>
        <SearchableSelect
          value={formState.fromCountryId}
          options={fromCountryOptions}
          placeholder="Search from country..."
          onChange={(value) => onChange("fromCountryId", value)}
          error={errors.fromCountryId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">To Country</label>
        <SearchableSelect
          value={formState.toCountryId}
          options={toCountryOptions}
          placeholder="Search to country..."
          onChange={(value) => onChange("toCountryId", value)}
          error={errors.toCountryId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Date</label>
        <div className="flex-1">
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.date ? formState.date.split("T")[0] : ""}
            onChange={(e) => {
              const dateValue = e.target.value;
              if (dateValue) {
                // Convert date to ISO string format
                const date = new Date(dateValue);
                onChange("date", date.toISOString());
              } else {
                onChange("date", "");
              }
            }}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">First Name</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Last Name</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Email</label>
        <div className="flex-1">
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Phone</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Days</label>
        <div className="flex-1">
          <input
            type="number"
            min="1"
            step="1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.days || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 1 : parseInt(value, 10);
              onChange("days", isNaN(numValue) ? 1 : numValue);
            }}
            placeholder="Enter number of days"
          />
          {errors.days && (
            <p className="mt-1 text-xs text-red-600">{errors.days}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Entry Type</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.entryType}
            onChange={(e) => onChange("entryType", e.target.value)}
            placeholder="Enter entry type"
          />
          {errors.entryType && (
            <p className="mt-1 text-xs text-red-600">{errors.entryType}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Visa Type</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.visaType}
            onChange={(e) => onChange("visaType", e.target.value)}
            placeholder="Enter visa type"
          />
          {errors.visaType && (
            <p className="mt-1 text-xs text-red-600">{errors.visaType}</p>
          )}
        </div>
      </div>
    </form>
  );
}
