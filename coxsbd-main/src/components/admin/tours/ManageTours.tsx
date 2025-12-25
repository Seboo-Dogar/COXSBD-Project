"use client";

import React, { FormEvent, useState } from "react";
import { Globe } from "lucide-react";
import {
  useTours,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
} from "@/hooks/useTours";
import { CurrencyCode } from "@/types/Tour";
import TourForm from "./TourForm";
import ToursTable from "./ToursTable";

export default function ManageTours(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formState, setFormState] = useState({
    tourTypeId: "",
    name: "",
    userId: "",
    location: "",
    adultPrice: 0,
    childPrice: 0,
    maxAdults: 1,
    maxChild: 0,
    description: "",
    policy: "",
    currency: "BDT" as CurrencyCode,
    status: true,
    featured: false,
    refundable: false,
    offer: false,
    stars: 0,
    rating: 0,
    inclusions: [] as string[],
    exclusions: [] as string[],
  });

  const { data, isLoading, isError } = useTours({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      tourTypeId: "",
      name: "",
      userId: "",
      location: "",
      adultPrice: 0,
      childPrice: 0,
      maxAdults: 1,
      maxChild: 0,
      description: "",
      policy: "",
      currency: "BDT",
      status: true,
      featured: false,
      refundable: false,
      offer: false,
      stars: 0,
      rating: 0,
      inclusions: [],
      exclusions: [],
    });
  };

  const createTour = useCreateTour(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateTour = useUpdateTour(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteTour = useDeleteTour();

  const tours = data?.tours ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.tourTypeId || !formState.name || !formState.userId || !formState.location) return;
    
    const payload = {
      ...formState,
      stars: formState.stars || undefined,
      rating: formState.rating || undefined,
      inclusions: formState.inclusions.length > 0 ? formState.inclusions : undefined,
      exclusions: formState.exclusions.length > 0 ? formState.exclusions : undefined,
    };
    
    if (editingId) {
      updateTour.mutate({
        id: editingId,
        payload,
      });
    } else {
      createTour.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-red-600" />
          Tours
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
                form="tour-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createTour.isPending || updateTour.isPending}
              >
                {createTour.isPending || updateTour.isPending
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
              Add Tour
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {isAdding ? (
          <TourForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <ToursTable
            tours={tours}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(tour) => {
              setIsAdding(true);
              setEditingId(tour.id);
              setFormState({
                tourTypeId: tour.tourTypeId ?? "",
                name: tour.name ?? "",
                userId: tour.userId ?? "",
                location: tour.location ?? "",
                adultPrice: typeof tour.adultPrice === "number" 
                  ? tour.adultPrice 
                  : parseFloat(String(tour.adultPrice ?? 0)) || 0,
                childPrice: typeof tour.childPrice === "number" 
                  ? tour.childPrice 
                  : parseFloat(String(tour.childPrice ?? 0)) || 0,
                maxAdults: typeof tour.maxAdults === "number" 
                  ? tour.maxAdults 
                  : parseInt(String(tour.maxAdults ?? 1), 10) || 1,
                maxChild: typeof tour.maxChild === "number" 
                  ? tour.maxChild 
                  : parseInt(String(tour.maxChild ?? 0), 10) || 0,
                description: tour.description ?? "",
                policy: tour.policy ?? "",
                currency: (tour.currency as CurrencyCode) || "BDT",
                status: Boolean(tour.status),
                featured: Boolean(tour.featured),
                refundable: Boolean(tour.refundable),
                offer: Boolean(tour.offer),
                stars: typeof tour.stars === "number" ? tour.stars : 0,
                rating: typeof tour.rating === "number" ? tour.rating : 0,
                inclusions: tour.inclusions?.map((inc) => inc.id) || [],
                exclusions: tour.exclusions?.map((exc) => exc.id) || [],
              });
            }}
            onDelete={(tour) =>
              setDeleteTarget({
                id: tour.id,
                name: tour.name,
              })
            }
            onToggleStatus={(tour) =>
              updateTour.mutate({
                id: tour.id,
                payload: { status: !tour.status },
              })
            }
            onToggleFeatured={(tour) =>
              updateTour.mutate({
                id: tour.id,
                payload: { featured: !tour.featured },
              })
            }
            onToggleOffer={(tour) =>
              updateTour.mutate({
                id: tour.id,
                payload: { offer: !tour.offer },
              })
            }
            isTogglingStatus={updateTour.isPending}
            isTogglingFeatured={updateTour.isPending}
            isTogglingOffer={updateTour.isPending}
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
              Delete Tour
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
                disabled={deleteTour.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteTour.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteTour.isPending}
              >
                {deleteTour.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
