"use client";

import React, { FormEvent, useState } from "react";
import {
  useTourTypes,
  useCreateTourType,
  useUpdateTourType,
  useDeleteTourType,
} from "@/hooks/useTourType";
import TourTypeForm from "./TourTypeForm";
import TourTypesTable from "./TourTypesTable";

export default function ManageTourTypes(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    name: "",
  });

  const { data, isLoading, isError } = useTourTypes({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      name: "",
    });
  };

  const createTourType = useCreateTourType(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateTourType = useUpdateTourType(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteTourType = useDeleteTourType();

  const tourTypes = data?.tourTypes ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;
    if (editingId) {
      updateTourType.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createTourType.mutate(formState);
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
                form="tour-type-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createTourType.isPending || updateTourType.isPending}
              >
                {createTourType.isPending || updateTourType.isPending
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
          <TourTypeForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <TourTypesTable
            tourTypes={tourTypes}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(tourType) => {
              setIsAdding(true);
              setEditingId(tourType.id);
              setFormState({
                name: tourType.name ?? "",
              });
            }}
            onDelete={(tourType) =>
              setDeleteTarget({
                id: tourType.id,
                name: tourType.name,
              })
            }
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
              Delete tour type
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">{deleteTarget.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteTourType.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteTourType.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteTourType.isPending}
              >
                {deleteTourType.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
