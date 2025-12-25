"use client";

import React, { FormEvent, useState } from "react";
import { Plane } from "lucide-react";
import {
  useFlightSuggestions,
  useCreateFlightSuggestion,
  useUpdateFlightSuggestion,
  useDeleteFlightSuggestion,
} from "@/hooks/useFlightSuggestion";
import FlightSuggestionForm from "./FlightSuggestionForm";
import FlightSuggestionsTable from "./FlightSuggestionsTable";

export default function ManageFlightSuggestions(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: string;
    cityAirport: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    type: "FROM_DESTINATION" as const,
    cityAirport: "",
    order: 0,
    status: true,
  });

  const { data, isLoading, isError } = useFlightSuggestions({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      type: "FROM_DESTINATION",
      cityAirport: "",
      order: 0,
      status: true,
    });
  };

  const createFlightSuggestion = useCreateFlightSuggestion(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateFlightSuggestion = useUpdateFlightSuggestion(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteFlightSuggestion = useDeleteFlightSuggestion();

  const flightSuggestions = data?.flightSuggestions ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.type || !formState.cityAirport || formState.order < 0) return;
    if (editingId) {
      updateFlightSuggestion.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createFlightSuggestion.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-6 w-6 text-red-600" />
          Flight Suggestions
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
                form="flight-suggestion-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createFlightSuggestion.isPending || updateFlightSuggestion.isPending}
              >
                {createFlightSuggestion.isPending || updateFlightSuggestion.isPending
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
          <FlightSuggestionForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <FlightSuggestionsTable
            flightSuggestions={flightSuggestions}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(flightSuggestion) => {
              setIsAdding(true);
              setEditingId(flightSuggestion.id);
              setFormState({
                type: flightSuggestion.type,
                cityAirport: flightSuggestion.cityAirport ?? "",
                order: flightSuggestion.order ?? 0,
                status: Boolean(flightSuggestion.status),
              });
            }}
            onDelete={(flightSuggestion) =>
              setDeleteTarget({
                id: flightSuggestion.id,
                type: flightSuggestion.type,
                cityAirport: flightSuggestion.cityAirport,
              })
            }
            onToggleStatus={(flightSuggestion) =>
              updateFlightSuggestion.mutate({
                id: flightSuggestion.id,
                payload: { status: !flightSuggestion.status },
              })
            }
            isTogglingStatus={updateFlightSuggestion.isPending}
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
              Delete flight suggestion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deleteTarget.type} - {deleteTarget.cityAirport}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteFlightSuggestion.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteFlightSuggestion.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteFlightSuggestion.isPending}
              >
                {deleteFlightSuggestion.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
