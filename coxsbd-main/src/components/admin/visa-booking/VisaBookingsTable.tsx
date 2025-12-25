"use client";

import type React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { VisaBooking } from "@/types/VisaBooking";
import { VisaStatus } from "@/types/VisaBooking";

type VisaBookingsTableProps = {
  visaBookings: VisaBooking[];
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  onEdit: (visaBooking: VisaBooking) => void;
  onDelete: (visaBooking: VisaBooking) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const getStatusBadgeColor = (status: VisaStatus) => {
  switch (status) {
    case VisaStatus.WAITING:
      return "bg-yellow-100 text-yellow-800";
    case VisaStatus.PROGRESS:
      return "bg-blue-100 text-blue-800";
    case VisaStatus.DONE:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function VisaBookingsTable({
  visaBookings,
  page,
  pageSize,
  totalPages,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: VisaBookingsTableProps): React.JSX.Element {
  if (isLoading) {
    return <p className="text-gray-600 text-sm">Loading visa bookings...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load visa bookings. Please try again.
      </p>
    );
  }

  if (!visaBookings.length) {
    return <p className="text-gray-600 text-sm">No visa bookings found.</p>;
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
                From → To
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Date
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
            {visaBookings.map((visaBooking, index) => (
              <tr key={visaBooking.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-gray-700 text-xs">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="px-4 py-2 border-b text-gray-800 text-xs">
                  {visaBooking.fromCountry?.country || "N/A"} →{" "}
                  {visaBooking.toCountry?.country || "N/A"}
                </td>
                <td className="px-4 py-2 border-b text-gray-800 text-sm">
                  {visaBooking.firstName} {visaBooking.lastName}
                </td>
                <td className="px-4 py-2 border-b text-gray-800 text-xs">
                  {visaBooking.email}
                </td>
                <td className="px-4 py-2 border-b text-gray-800 text-xs">
                  {visaBooking.date
                    ? new Date(visaBooking.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      visaBooking.status
                    )}`}
                  >
                    {visaBooking.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-right space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition"
                    onClick={() => onEdit(visaBooking)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition"
                    onClick={() => onDelete(visaBooking)}
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
