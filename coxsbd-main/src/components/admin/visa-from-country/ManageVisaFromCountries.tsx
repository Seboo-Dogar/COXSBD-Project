"use client";

import React, { FormEvent, useState } from "react";
import {
  useVisaFromCountries,
  useCreateVisaFromCountry,
  useUpdateVisaFromCountry,
  useDeleteVisaFromCountry,
} from "@/hooks/useVisaFromCountry";
import VisaFromCountryForm from "./VisaFromCountryForm";
import VisaFromCountriesTable from "./VisaFromCountriesTable";

export default function ManageVisaFromCountries(): React.ReactNode {
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

  const { data, isLoading, isError } = useVisaFromCountries({
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

  const createVisaFromCountry = useCreateVisaFromCountry(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateVisaFromCountry = useUpdateVisaFromCountry(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteVisaFromCountry = useDeleteVisaFromCountry();

  const visaFromCountries = data?.visaFromCountries ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.country || !formState.nicename || !formState.iso) return;
    
    if (editingId) {
      updateVisaFromCountry.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createVisaFromCountry.mutate(formState);
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
                form="visa-from-country-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createVisaFromCountry.isPending || updateVisaFromCountry.isPending}
              >
                {createVisaFromCountry.isPending || updateVisaFromCountry.isPending
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
          <VisaFromCountryForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <VisaFromCountriesTable
            visaFromCountries={visaFromCountries}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(visaFromCountry) => {
              setIsAdding(true);
              setEditingId(visaFromCountry.id);
              setFormState({
                country: visaFromCountry.country ?? "",
                nicename: visaFromCountry.nicename ?? "",
                iso: visaFromCountry.iso ?? "",
                status: Boolean(visaFromCountry.status),
              });
            }}
            onDelete={(visaFromCountry) =>
              setDeleteTarget({
                id: visaFromCountry.id,
                country: visaFromCountry.country,
              })
            }
            onToggleStatus={(visaFromCountry) =>
              updateVisaFromCountry.mutate({
                id: visaFromCountry.id,
                payload: { status: !visaFromCountry.status },
              })
            }
            isTogglingStatus={updateVisaFromCountry.isPending}
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
              Delete visa from country
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
                disabled={deleteVisaFromCountry.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteVisaFromCountry.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteVisaFromCountry.isPending}
              >
                {deleteVisaFromCountry.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
