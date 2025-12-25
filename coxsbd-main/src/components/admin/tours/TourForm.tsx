"use client";

import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { useAllTourTypes } from "@/hooks/useTourType";
import { useAllTourInclusions } from "@/hooks/useTourInclusion";
import { useAllTourExclusions } from "@/hooks/useTourExclusion";
import { useMerchantUsers } from "@/hooks/useMerchantUsers";
import SearchableSelect from "../../common/SearchableSelect";
import { CurrencyCode } from "@/types/Tour";

type TourFormState = {
  tourTypeId: string;
  name: string;
  userId: string;
  location: string;
  adultPrice: number;
  childPrice: number;
  maxAdults: number;
  maxChild: number;
  description: string;
  policy: string;
  currency: CurrencyCode;
  status: boolean;
  featured: boolean;
  refundable: boolean;
  offer: boolean;
  stars: number;
  rating: number;
  inclusions: string[];
  exclusions: string[];
};

type TourFormProps = {
  formState: TourFormState;
  onChange: (field: keyof TourFormState, value: string | boolean | number | string[]) => void;
  onSubmit: (e: FormEvent) => void;
};

const tourSchema = z.object({
  tourTypeId: z.string().min(1, "Tour type is required"),
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(1, "User ID is required"),
  location: z.string().min(1, "Location is required"),
  adultPrice: z.coerce.number().positive("Adult price must be greater than 0"),
  childPrice: z.coerce.number().min(0, "Child price must be 0 or greater"),
  maxAdults: z.coerce.number().min(1, "Max adults must be at least 1"),
  maxChild: z.coerce.number().min(0, "Max child must be 0 or greater"),
  description: z.string().min(1, "Description is required"),
  policy: z.string().min(1, "Policy is required"),
  currency: z.enum(["BDT", "USD", "EUR", "INR", "GBP"]),
  status: z.boolean(),
  featured: z.boolean(),
  refundable: z.boolean(),
  offer: z.boolean(),
  stars: z.coerce.number().min(0).max(5).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
});

type Errors = Partial<Record<keyof TourFormState, string>>;

export default function TourForm({
  formState,
  onChange,
  onSubmit,
}: TourFormProps): React.JSX.Element {
  const [errors, setErrors] = useState<Errors>({});
  const { data: tourTypes = [] } = useAllTourTypes();
  const { data: inclusions = [] } = useAllTourInclusions();
  const { data: exclusions = [] } = useAllTourExclusions();
  const { data: merchantUsersData } = useMerchantUsers({ limit: 1000 });

  const tourTypeOptions = tourTypes.map((type) => ({
    id: type.id,
    label: type.name,
  }));

  const inclusionOptions = inclusions.map((inc) => ({
    id: inc.id,
    label: inc.name,
  }));

  const exclusionOptions = exclusions.map((exc) => ({
    id: exc.id,
    label: exc.name,
  }));

  const merchantUsers = merchantUsersData?.users ?? [];
  const merchantUserOptions = merchantUsers.map((user) => ({
    id: user.id,
    label: `${user.email}`,
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = tourSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TourFormState;
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

  const handleInclusionSelect = (inclusionId: string) => {
    if (!formState.inclusions.includes(inclusionId)) {
      onChange("inclusions", [...formState.inclusions, inclusionId]);
    }
  };

  const handleInclusionRemove = (inclusionId: string) => {
    onChange("inclusions", formState.inclusions.filter((id) => id !== inclusionId));
  };

  const handleExclusionSelect = (exclusionId: string) => {
    if (!formState.exclusions.includes(exclusionId)) {
      onChange("exclusions", [...formState.exclusions, exclusionId]);
    }
  };

  const handleExclusionRemove = (exclusionId: string) => {
    onChange("exclusions", formState.exclusions.filter((id) => id !== exclusionId));
  };

  const getSelectedInclusions = () => {
    return inclusionOptions.filter((opt) => formState.inclusions.includes(opt.id));
  };

  const getSelectedExclusions = () => {
    return exclusionOptions.filter((opt) => formState.exclusions.includes(opt.id));
  };

  const getAvailableInclusions = () => {
    return inclusionOptions.filter((opt) => !formState.inclusions.includes(opt.id));
  };

  const getAvailableExclusions = () => {
    return exclusionOptions.filter((opt) => !formState.exclusions.includes(opt.id));
  };

  return (
    <form
      id="tour-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl"
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
        <label className="w-32 text-sm font-medium text-gray-700">Featured</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.featured ? "yes" : "no"}
            onChange={(e) => onChange("featured", e.target.value === "yes")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Tour Type</label>
        <SearchableSelect
          value={formState.tourTypeId}
          options={tourTypeOptions}
          placeholder="Search tour type..."
          onChange={(value) => onChange("tourTypeId", value)}
          error={errors.tourTypeId}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Name</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
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
        <label className="w-32 text-sm font-medium text-gray-700">Location</label>
        <div className="flex-1">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Currency</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value={formState.currency}
            onChange={(e) => onChange("currency", e.target.value as CurrencyCode)}
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>
          {errors.currency && (
            <p className="mt-1 text-xs text-red-600">{errors.currency}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Adult Price</label>
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.adultPrice || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("adultPrice", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.adultPrice && (
            <p className="mt-1 text-xs text-red-600">{errors.adultPrice}</p>
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
        <label className="w-32 text-sm font-medium text-gray-700">Max Adults</label>
        <div className="flex-1">
          <input
            type="number"
            min="1"
            step="1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.maxAdults}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 1 : parseInt(value, 10);
              onChange("maxAdults", isNaN(numValue) ? 1 : numValue);
            }}
          />
          {errors.maxAdults && (
            <p className="mt-1 text-xs text-red-600">{errors.maxAdults}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Max Child</label>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            step="1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.maxChild}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseInt(value, 10);
              onChange("maxChild", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.maxChild && (
            <p className="mt-1 text-xs text-red-600">{errors.maxChild}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Stars</label>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            max="5"
            step="1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.stars || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseInt(value, 10);
              onChange("stars", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.stars && (
            <p className="mt-1 text-xs text-red-600">{errors.stars}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="w-32 text-sm font-medium text-gray-700">Rating</label>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.rating || ""}
            onChange={(e) => {
              const value = e.target.value;
              const numValue = value === "" ? 0 : parseFloat(value);
              onChange("rating", isNaN(numValue) ? 0 : numValue);
            }}
          />
          {errors.rating && (
            <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <label className="w-32 text-sm font-medium text-gray-700 pt-2">Description</label>
        <div className="flex-1">
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <label className="w-32 text-sm font-medium text-gray-700 pt-2">Policy</label>
        <div className="flex-1">
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm"
            value={formState.policy}
            onChange={(e) => onChange("policy", e.target.value)}
          />
          {errors.policy && (
            <p className="mt-1 text-xs text-red-600">{errors.policy}</p>
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

      <div className="flex items-start gap-4">
        <label className="w-32 text-sm font-medium text-gray-700 pt-2">Inclusions</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleInclusionSelect(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Select an inclusion...</option>
            {getAvailableInclusions().map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {getSelectedInclusions().length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {getSelectedInclusions().map((inclusion) => (
                <span
                  key={inclusion.id}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {inclusion.label}
                  <button
                    type="button"
                    onClick={() => handleInclusionRemove(inclusion.id)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.inclusions && (
            <p className="mt-1 text-xs text-red-600">{errors.inclusions}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <label className="w-32 text-sm font-medium text-gray-700 pt-2">Exclusions</label>
        <div className="flex-1">
          <select
            className="w-full border rounded px-3 py-2 text-sm bg-white"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleExclusionSelect(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Select an exclusion...</option>
            {getAvailableExclusions().map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {getSelectedExclusions().length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {getSelectedExclusions().map((exclusion) => (
                <span
                  key={exclusion.id}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                >
                  {exclusion.label}
                  <button
                    type="button"
                    onClick={() => handleExclusionRemove(exclusion.id)}
                    className="hover:bg-red-200 rounded-full p-0.5 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.exclusions && (
            <p className="mt-1 text-xs text-red-600">{errors.exclusions}</p>
          )}
        </div>
      </div>
    </form>
  );
}
