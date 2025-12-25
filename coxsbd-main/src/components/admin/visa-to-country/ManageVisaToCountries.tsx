"use client";

import React, { FormEvent, useState } from "react";
import {
  useVisaToCountries,
  useCreateVisaToCountry,
  useUpdateVisaToCountry,
  useDeleteVisaToCountry,
} from "@/hooks/useVisaToCountry";
import VisaToCountryForm from "./VisaToCountryForm";
import VisaToCountriesTable from "./VisaToCountriesTable";

export default function ManageVisaToCountries(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    country: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    country: "",
    nicename: "",
    iso: "",
    status: true,
  });

  const { data, isLoading, isError } = useVisaToCountries({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      country: "",
      nicename: "",
      iso: "",
      status: true,
    });
  };

  const createVisaToCountry = useCreateVisaToCountry(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateVisaToCountry = useUpdateVisaToCountry(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteVisaToCountry = useDeleteVisaToCountry();

  const visaToCountries = data?.visaToCountries ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.country || !formState.nicename || !formState.iso) return;
    
    if (editingId) {
      updateVisaToCountry.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createVisaToCountry.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-2">
          {isAdding ? (
            <>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                Back
              </button>
              <button
                type="submit"
                form="visa-to-country-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createVisaToCountry.isPending || updateVisaToCountry.isPending}
              >
                {createVisaToCountry.isPending || updateVisaToCountry.isPending
                  ? "Saving..."
                  : "Save"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
              onClick={() => {
                setEditingId(null);
                resetForm();
                setIsAdding(true);
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {isAdding ? (
          <VisaToCountryForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <VisaToCountriesTable
            visaToCountries={visaToCountries}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(visaToCountry) => {
              setIsAdding(true);
              setEditingId(visaToCountry.id);
              setFormState({
                country: visaToCountry.country ?? "",
                nicename: visaToCountry.nicename ?? "",
                iso: visaToCountry.iso ?? "",
                status: Boolean(visaToCountry.status),
              });
            }}
            onDelete={(visaToCountry) =>
              setDeleteTarget({
                id: visaToCountry.id,
                country: visaToCountry.country,
              })
            }
            onToggleStatus={(visaToCountry) =>
              updateVisaToCountry.mutate({
                id: visaToCountry.id,
                payload: { status: !visaToCountry.status },
              })
            }
            isTogglingStatus={updateVisaToCountry.isPending}
            onPageChange={(nextPage) => {
              if (nextPage < 1 || nextPage > totalPages) return;
              setPage(nextPage);
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete visa to country
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteTarget.country}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteVisaToCountry.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteVisaToCountry.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteVisaToCountry.isPending}
              >
                {deleteVisaToCountry.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
