// src/components/car/CarListAdmin.tsx
"use client";

import Link from "next/link";
import { Plus, Edit, Trash2, Car as CarIcon, Loader2, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";
import { BASE_API_URL } from "@/utils/config";
import { Car } from "@/types/Car";

const formatPrice = (priceString: string) => {
  return priceString || '$0.00'; 
};

export default function CarListAdmin() {
  const [cars, setCars] = useState<Car[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig().get(`${BASE_API_URL}/cars`); 
      setCars(response.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle Deletion using Prisma 'id'
  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axiosConfig().delete(`${BASE_API_URL}/cars/${id}`);
      // Filter list based on 'id'
      setCars(cars.filter((c) => c.id !== id));
      alert("Car deleted successfully.");
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      alert(`Error deleting car: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <CarIcon size={28} className="text-red-600" /> Car Management
        </h1>
        <Link
          href="/admin/car/add"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add New Car</span>
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <Loader2 className="animate-spin h-6 w-6 inline mr-2" /> Loading car data...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Name/Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {car.name} {car.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <DollarSign size={14} className="mr-1 text-gray-400" />
                    {formatPrice(car.price)} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        car.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {car.available ? "Available" : "Booked/Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/car/${car.id}`} // Fixed: Using id for routing
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mr-3"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => car.id && handleDelete(car.id)} // Fixed: Using id for delete
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {cars.length === 0 && !loading && (
        <p className="mt-4 text-center text-gray-500">No cars found. Start by adding one!</p>
      )}
    </div>
  );
}