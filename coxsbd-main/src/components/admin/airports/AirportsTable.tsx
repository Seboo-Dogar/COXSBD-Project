"use client";

import type React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Airport } from "@/types/Airport";

type AirportsTableProps = {
  airports: Airport[];
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  onEdit: (airport: Airport) => void;
  onDelete: (airport: Airport) => void;
  onToggleStatus: (airport: Airport) => void;
  isTogglingStatus: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function AirportsTable({
  airports,
  page,
  pageSize,
  totalPages,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onToggleStatus,
  isTogglingStatus,
  onPageChange,
  onPageSizeChange,
}: AirportsTableProps): React.JSX.Element {
  if (isLoading) {
    return <p className="text-gray-600 text-sm">Loading airports...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load airports. Please try again.
      </p>
    );
  }

  if (!airports.length) {
    return <p className="text-gray-600 text-sm">No airports found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700 w-16">
                #
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Code
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Airport
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                City
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Country
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 border-b text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport, index) => (
              <tr key={airport.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-gray-700 text-xs">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {airport.code}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {airport.airport}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {airport.city}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {airport.country}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(airport)}
                    disabled={isTogglingStatus}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                      airport.status
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-200 border-gray-300"
                    } ${
                      isTogglingStatus ? "opacity-60" : "hover:brightness-105"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        airport.status ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-2 border-b text-right space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition"
                    onClick={() => onEdit(airport)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition"
                    onClick={() => onDelete(airport)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Rows per page:</span>
          <select
            className="border rounded px-2 py-1 text-xs bg-white"
            value={pageSize}
            onChange={(e) => {
              const next = Number(e.target.value) || 25;
              onPageSizeChange(next);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-4">
            Page {page} of {totalPages}
          </span>
        </div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
