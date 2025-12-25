"use client";

import React, { FormEvent, useState } from "react";
import { Package } from "lucide-react";
import {
  useVisaBookings,
  useCreateVisaBooking,
  useUpdateVisaBooking,
  useDeleteVisaBooking,
} from "@/hooks/useVisaBooking";
import { VisaStatus } from "@/types/VisaBooking";
import VisaBookingForm from "./VisaBookingForm";
import VisaBookingsTable from "./VisaBookingsTable";

export default function ManageVisaBookings(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    status: VisaStatus.WAITING,
    fromCountryId: "",
    toCountryId: "",
    date: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    days: 1,
    entryType: "",
    visaType: "",
  });

  const { data, isLoading, isError } = useVisaBookings({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      status: VisaStatus.WAITING,
      fromCountryId: "",
      toCountryId: "",
      date: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      days: 1,
      entryType: "",
      visaType: "",
    });
  };

  const createVisaBooking = useCreateVisaBooking(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateVisaBooking = useUpdateVisaBooking(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteVisaBooking = useDeleteVisaBooking();

  const visaBookings = data?.visaBookings ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !formState.fromCountryId ||
      !formState.toCountryId ||
      !formState.date ||
      !formState.firstName ||
      !formState.lastName ||
      !formState.email ||
      !formState.phone ||
      !formState.entryType ||
      !formState.visaType
    )
      return;

    if (editingId) {
      updateVisaBooking.mutate({
        id: editingId,
        payload: formState,
      });
    } else {
      createVisaBooking.mutate(formState);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-red-600" />
          Visa Bookings
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
                form="visa-booking-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createVisaBooking.isPending || updateVisaBooking.isPending}
              >
                {createVisaBooking.isPending || updateVisaBooking.isPending
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
              Add Booking
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {isAdding ? (
          <VisaBookingForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <VisaBookingsTable
            visaBookings={visaBookings}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(visaBooking) => {
              setIsAdding(true);
              setEditingId(visaBooking.id);
              setFormState({
                status: visaBooking.status || VisaStatus.WAITING,
                fromCountryId: visaBooking.fromCountryId ?? "",
                toCountryId: visaBooking.toCountryId ?? "",
                date: visaBooking.date
                  ? new Date(visaBooking.date).toISOString()
                  : "",
                firstName: visaBooking.firstName ?? "",
                lastName: visaBooking.lastName ?? "",
                email: visaBooking.email ?? "",
                phone: visaBooking.phone ?? "",
                days: typeof visaBooking.days === "number" ? visaBooking.days : 1,
                entryType: visaBooking.entryType ?? "",
                visaType: visaBooking.visaType ?? "",
              });
            }}
            onDelete={(visaBooking) =>
              setDeleteTarget({
                id: visaBooking.id,
                name: `${visaBooking.firstName} ${visaBooking.lastName}`,
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
              Delete visa booking
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the booking for{" "}
              <span className="font-medium">{deleteTarget.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteVisaBooking.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteVisaBooking.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteVisaBooking.isPending}
              >
                {deleteVisaBooking.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
