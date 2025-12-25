"use client";

import React, { FormEvent, useState } from "react";
import { Plane } from "lucide-react";
import {
  useAirports,
  useCreateAirport,
  useUpdateAirport,
  useDeleteAirport,
} from "@/hooks/useAirports";
import AirportForm from "./AirportForm";
import AirportsTable from "./AirportsTable";

export default function ManageAirports(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    code: string;
    airport: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    code: "",
    airport: "",
    city: "",
    country: "",
    status: true,
  });

  const { data, isLoading, isError } = useAirports({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      code: "",
      airport: "",
      city: "",
      country: "",
      status: true,
    });
  };

  const createAirport = useCreateAirport(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateAirport = useUpdateAirport(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteAirport = useDeleteAirport();

  const airports = data?.airports ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.code || !formState.airport) return;
    if (editingId) {
      updateAirport.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createAirport.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-6 w-6 text-red-600" />
          Airports
        </h1>
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
                form="airport-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createAirport.isPending || updateAirport.isPending}
              >
                {createAirport.isPending || updateAirport.isPending
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
          <AirportForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <AirportsTable
            airports={airports}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(airport) => {
              setIsAdding(true);
              setEditingId(airport.id);
              setFormState({
                code: airport.code ?? "",
                airport: airport.airport ?? "",
                city: airport.city ?? "",
                country: airport.country ?? "",
                status: Boolean(airport.status),
              });
            }}
            onDelete={(airport) =>
              setDeleteTarget({
                id: airport.id,
                code: airport.code,
                airport: airport.airport,
              })
            }
            onToggleStatus={(airport) =>
              updateAirport.mutate({
                id: airport.id,
                payload: { status: !airport.status },
              })
            }
            isTogglingStatus={updateAirport.isPending}
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
              Delete airport
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deleteTarget.airport} ({deleteTarget.code})
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteAirport.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteAirport.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteAirport.isPending}
              >
                {deleteAirport.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
