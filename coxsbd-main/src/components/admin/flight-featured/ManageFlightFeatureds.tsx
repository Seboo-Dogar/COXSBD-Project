"use client";

import React, { FormEvent, useState } from "react";
import { Plane } from "lucide-react";
import {
  useFlightFeatureds,
  useCreateFlightFeatured,
  useUpdateFlightFeatured,
  useDeleteFlightFeatured,
} from "@/hooks/useFlightFeatured";
import FlightFeaturedForm from "./FlightFeaturedForm";
import FlightFeaturedsTable from "./FlightFeaturedsTable";

export default function ManageFlightFeatureds(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    airlineName: string;
    fromAirportName: string;
    toAirportName: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    airlineId: "",
    fromAirportId: "",
    toAirportId: "",
    price: 0,
    status: true,
  });

  const { data, isLoading, isError } = useFlightFeatureds({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      airlineId: "",
      fromAirportId: "",
      toAirportId: "",
      price: 0,
      status: true,
    });
  };

  const createFlightFeatured = useCreateFlightFeatured(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateFlightFeatured = useUpdateFlightFeatured(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteFlightFeatured = useDeleteFlightFeatured();

  const flightFeatureds = data?.flightFeatureds ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.airlineId || !formState.fromAirportId || !formState.toAirportId || !formState.price || formState.price <= 0) return;
    if (editingId) {
      updateFlightFeatured.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createFlightFeatured.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-6 w-6 text-red-600" />
          Featured Flights
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
                form="flight-featured-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createFlightFeatured.isPending || updateFlightFeatured.isPending}
              >
                {createFlightFeatured.isPending || updateFlightFeatured.isPending
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
          <FlightFeaturedForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <FlightFeaturedsTable
            flightFeatureds={flightFeatureds}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(flightFeatured) => {
              setIsAdding(true);
              setEditingId(flightFeatured.id);
              setFormState({
                airlineId: flightFeatured.airlineId ?? "",
                fromAirportId: flightFeatured.fromAirportId ?? "",
                toAirportId: flightFeatured.toAirportId ?? "",
                price: typeof flightFeatured.price === "number" 
                  ? flightFeatured.price 
                  : parseFloat(String(flightFeatured.price ?? 0)) || 0,
                status: Boolean(flightFeatured.status),
              });
            }}
            onDelete={(flightFeatured) =>
              setDeleteTarget({
                id: flightFeatured.id,
                airlineName: flightFeatured.airline
                  ? `${flightFeatured.airline.name} (${flightFeatured.airline.code})`
                  : "N/A",
                fromAirportName: flightFeatured.fromAirport
                  ? `${flightFeatured.fromAirport.airport} (${flightFeatured.fromAirport.code})`
                  : "N/A",
                toAirportName: flightFeatured.toAirport
                  ? `${flightFeatured.toAirport.airport} (${flightFeatured.toAirport.code})`
                  : "N/A",
              })
            }
            onToggleStatus={(flightFeatured) =>
              updateFlightFeatured.mutate({
                id: flightFeatured.id,
                payload: { status: !flightFeatured.status },
              })
            }
            isTogglingStatus={updateFlightFeatured.isPending}
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
              Delete featured flight
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deleteTarget.airlineName}: {deleteTarget.fromAirportName} → {deleteTarget.toAirportName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteFlightFeatured.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteFlightFeatured.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteFlightFeatured.isPending}
              >
                {deleteFlightFeatured.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
