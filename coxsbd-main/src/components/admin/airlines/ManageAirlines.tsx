"use client";

import React, { FormEvent, useState } from "react";
import { Plane } from "lucide-react";
import {
  useAirlines,
  useCreateAirline,
  useUpdateAirline,
  useDeleteAirline,
} from "@/hooks/useAirlines";
import AirlineForm from "./AirlineForm";
import AirlinesTable from "./AirlinesTable";

export default function ManageAirlines(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    iata: "",
    name: "",
    code: "",
    country: "",
    status: true,
  });

  const { data, isLoading, isError } = useAirlines({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      iata: "",
      name: "",
      code: "",
      country: "",
      status: true,
    });
  };

  const createAirline = useCreateAirline(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateAirline = useUpdateAirline(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteAirline = useDeleteAirline();

  const airlines = data?.airlines ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.iata || !formState.name || !formState.code) return;
    if (editingId) {
      updateAirline.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createAirline.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-6 w-6 text-red-600" />
          Airlines
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
                form="airline-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createAirline.isPending || updateAirline.isPending}
              >
                {createAirline.isPending || updateAirline.isPending
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
          <AirlineForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <AirlinesTable
            airlines={airlines}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(airline) => {
              setIsAdding(true);
              setEditingId(airline.id);
              setFormState({
                iata: airline.iata ?? "",
                name: airline.name ?? "",
                code: airline.code ?? "",
                country: airline.country ?? "",
                status: Boolean(airline.status),
              });
            }}
            onDelete={(airline) =>
              setDeleteTarget({
                id: airline.id,
                name: airline.name,
                code: airline.code,
              })
            }
            onToggleStatus={(airline) =>
              updateAirline.mutate({
                id: airline.id,
                payload: { status: !airline.status },
              })
            }
            isTogglingStatus={updateAirline.isPending}
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
              Delete airline
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deleteTarget.name} ({deleteTarget.code})
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteAirline.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteAirline.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteAirline.isPending}
              >
                {deleteAirline.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
