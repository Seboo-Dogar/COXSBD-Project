"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Plus, Star, MapPin, HotelIcon } from "lucide-react";
import axiosConfig from "@/utils/axiosConfig";
import { BASE_API_URL } from "@/utils/config";

type Hotel = {
  id: string;
  name: string;
  enabled: boolean;
  featured: boolean;
  featuredImage: string;
  offer: boolean;
  locationName: string;
  stars: number;
};

export default function Hotel() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  function fetchHotels() {
    axiosConfig()
      .get(`${BASE_API_URL}/hotels`)
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
      });
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const handleToggle = (
    id: string,
    field: "enabled" | "featured" | "offer"
  ) => {
    const path = `${BASE_API_URL}/hotels/${id}/set-${field}`;

    if (field !== "offer")
      axiosConfig()
        .put(path, {
          [field]: !hotels.find((hotel) => hotel.id === id)?.[field],
        })
        .then((r) => {
          console.log(r);
          fetchHotels();
          alert("Hotel status updated successfully");
        });

    setHotels(
      hotels.map((hotel) =>
        hotel.id === id ? { ...hotel, [field]: !hotel[field] } : hotel
      )
    );
  };

  const handleDelete = (id: string) => {
    //setHotels(hotels.filter((hotel) => hotel.id !== id))
    axiosConfig()
      .delete(`${BASE_API_URL}/hotels/${id}`)
      .then(() => {
        fetchHotels();
        alert("Hotel deleted successfully");
      });
    setShowDeleteModal(false);
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your hotel listings and availability
          </p>
        </div>
        <Link
          href="/admin/hotel/modify/add"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add New Hotel</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(hotel.id, "enabled")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        hotel.enabled ? "bg-green-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hotel.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(hotel.id, "featured")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        hotel.featured ? "bg-red-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hotel.featured ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(hotel.id, "offer")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        hotel.offer ? "bg-red-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hotel.offer ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-20">
                        <img
                          src={hotel.featuredImage || "/placeholder.svg"}
                          alt={hotel.name}
                          className="h-14 w-20 object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {hotel.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{hotel.id.substring(0, 10)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin size={16} className="text-gray-400 mr-1" />
                      {hotel.locationName.substring(0, 20)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(hotel.stars)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        href={`/admin/hotel/modify/${hotel.id}`}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Edit size={18} />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedHotel(hotel.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-500 text-center mb-6">
              Are you sure you want to delete this hotel? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedHotel && handleDelete(selectedHotel)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state (shown when no hotels) */}
      {hotels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <HotelIcon size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hotels found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You havent added any hotels yet. Get started by adding your first
            hotel listing.
          </p>
          <Link
            href="/admin/travel/hotels/add"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} />
            <span>Add New Hotel</span>
          </Link>
        </div>
      )}
    </div>
  );
}
