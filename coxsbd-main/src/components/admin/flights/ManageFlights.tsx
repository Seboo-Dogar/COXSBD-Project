"use client";

import React, { FormEvent, useState } from "react";
import { Plane } from "lucide-react";
import {
  useFlights,
  useCreateFlight,
  useUpdateFlight,
  useDeleteFlight,
} from "@/hooks/useFlights";
import { FlightType } from "@/types/Flight";
import FlightForm from "./FlightForm";
import FlightsTable from "./FlightsTable";

export default function ManageFlights(): React.ReactNode {
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
    userId: "",
    airlineId: "",
    fromAirportId: "",
    toAirportId: "",
    adultSeatPrice: 0,
    childPrice: 0,
    infantPrice: 0,
    duration: "",
    departureTime: "",
    arrivalTime: "",
    baggage: "",
    cabinBaggage: "",
    type: "" as FlightType | "",
    status: true,
    refundable: false,
    offer: false,
  });

  const { data, isLoading, isError } = useFlights({
    page,
    limit: pageSize,
  });

  const resetForm = () => {
    setFormState({
      userId: "",
      airlineId: "",
      fromAirportId: "",
      toAirportId: "",
      adultSeatPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      duration: "",
      departureTime: "",
      arrivalTime: "",
      baggage: "",
      cabinBaggage: "",
    type: "" as FlightType | "",
    status: true,
    refundable: false,
    offer: false,
  });
  };

  const createFlight = useCreateFlight(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const updateFlight = useUpdateFlight(() => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  });

  const deleteFlight = useDeleteFlight();

  const flights = data?.flights ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.userId || !formState.airlineId || !formState.fromAirportId || !formState.toAirportId) return;
    
    // Prepare payload, converting empty string type to undefined
    const payload = {
      ...formState,
      type: formState.type === "" ? undefined : formState.type,
    };
    
    if (editingId) {
      updateFlight.mutate({
        id: editingId,
        payload,
      });
    } else {
      createFlight.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="h-6 w-6 text-red-600" />
          Flights
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
                form="flight-form"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={createFlight.isPending || updateFlight.isPending}
              >
                {createFlight.isPending || updateFlight.isPending
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
          <FlightForm
            formState={formState}
            onChange={(field, value) =>
              setFormState((s) => ({ ...s, [field]: value }))
            }
            onSubmit={handleSubmit}
          />
        ) : (
          <FlightsTable
            flights={flights}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            isLoading={isLoading}
            isError={isError}
            onEdit={(flight) => {
              setIsAdding(true);
              setEditingId(flight.id);
              setFormState({
                userId: flight.userId ?? "",
                airlineId: flight.airlineId ?? "",
                fromAirportId: flight.fromAirportId ?? "",
                toAirportId: flight.toAirportId ?? "",
                adultSeatPrice: typeof flight.adultSeatPrice === "number" 
                  ? flight.adultSeatPrice 
                  : parseFloat(String(flight.adultSeatPrice ?? 0)) || 0,
                childPrice: typeof flight.childPrice === "number" 
                  ? flight.childPrice 
                  : parseFloat(String(flight.childPrice ?? 0)) || 0,
                infantPrice: typeof flight.infantPrice === "number" 
                  ? flight.infantPrice 
                  : parseFloat(String(flight.infantPrice ?? 0)) || 0,
                duration: flight.duration ?? "",
                departureTime: flight.departureTime ?? "",
                arrivalTime: flight.arrivalTime ?? "",
                baggage: flight.baggage ?? "",
                cabinBaggage: flight.cabinBaggage ?? "",
                type: (flight.type as FlightType) || "",
                status: Boolean(flight.status),
                refundable: Boolean(flight.refundable),
                offer: Boolean(flight.offer),
              });
            }}
            onDelete={(flight) =>
              setDeleteTarget({
                id: flight.id,
                airlineName: flight.airline
                  ? `${flight.airline.name} (${flight.airline.code})`
                  : "N/A",
                fromAirportName: flight.fromAirport
                  ? `${flight.fromAirport.airport} (${flight.fromAirport.code})`
                  : "N/A",
                toAirportName: flight.toAirport
                  ? `${flight.toAirport.airport} (${flight.toAirport.code})`
                  : "N/A",
              })
            }
            onToggleStatus={(flight) =>
              updateFlight.mutate({
                id: flight.id,
                payload: { status: !flight.status },
              })
            }
            isTogglingStatus={updateFlight.isPending}
            onToggleOffer={(flight) =>
              updateFlight.mutate({
                id: flight.id,
                payload: { offer: !flight.offer },
              })
            }
            isTogglingOffer={updateFlight.isPending}
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
              Delete flight
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
                disabled={deleteFlight.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => {
                  if (!deleteTarget) return;
                  deleteFlight.mutate(deleteTarget.id, {
                    onSettled: () => setDeleteTarget(null),
                  });
                }}
                disabled={deleteFlight.isPending}
              >
                {deleteFlight.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
