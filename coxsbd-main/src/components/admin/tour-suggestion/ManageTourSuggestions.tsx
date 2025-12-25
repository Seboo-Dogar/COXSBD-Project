"use client";

import React, { FormEvent, useState } from "react";
import { Globe } from "lucide-react";
import {
  useTourSuggestions,
  useCreateTourSuggestion,
  useUpdateTourSuggestion,
  useDeleteTourSuggestion,
} from "@/hooks/useTourSuggestion";
import TourSuggestionForm from "./TourSuggestionForm";
import TourSuggestionsTable from "./TourSuggestionsTable";

export default function ManageTourSuggestions(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    city: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    city: "",
    order: 0,
    status: true,
  });

  const { data, isLoading, isError } = useTourSuggestions({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      city: "",
      order: 0,
      status: true,
    });
  };

  const createTourSuggestion = useCreateTourSuggestion(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateTourSuggestion = useUpdateTourSuggestion(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteTourSuggestion = useDeleteTourSuggestion();

  const tourSuggestions = data?.tourSuggestions ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.city || formState.order < 0) return;
    if (editingId) {
      updateTourSuggestion.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createTourSuggestion.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-red-600" />
          Tour Suggestions
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
                form="tour-suggestion-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createTourSuggestion.isPending || updateTourSuggestion.isPending}
              >
                {createTourSuggestion.isPending || updateTourSuggestion.isPending
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
          <TourSuggestionForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <TourSuggestionsTable
            tourSuggestions={tourSuggestions}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(tourSuggestion) => {
              setIsAdding(true);
              setEditingId(tourSuggestion.id);
              setFormState({
                city: tourSuggestion.city ?? "",
                order: tourSuggestion.order ?? 0,
                status: Boolean(tourSuggestion.status),
              });
            }}
            onDelete={(tourSuggestion) =>
              setDeleteTarget({
                id: tourSuggestion.id,
                city: tourSuggestion.city,
              })
            }
            onToggleStatus={(tourSuggestion) =>
              updateTourSuggestion.mutate({
                id: tourSuggestion.id,
                payload: { status: !tourSuggestion.status },
              })
            }
            isTogglingStatus={updateTourSuggestion.isPending}
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
              Delete tour suggestion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteTarget.city}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteTourSuggestion.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteTourSuggestion.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteTourSuggestion.isPending}
              >
                {deleteTourSuggestion.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
