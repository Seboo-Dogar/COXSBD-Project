"use client";

import React, { useState, useEffect, use, useRef } from "react"; 
import Link from "next/link";
import {
  ArrowLeft,
  Car as CarIcon,
  DollarSign,
  User,
  Image as ImageIcon,
  CheckCircle,
  X,
  Loader2,
  List,
  UploadCloud, // Added for the upload UI
} from "lucide-react";
import { useRouter } from "next/navigation";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";
import { Car } from "@/types/Car";

// Default state matching your SQL/Prisma schema
const initialCarState: Car = {
  id: 0, 
  name: "",
  model: "",
  year: new Date().getFullYear(),
  features: [],
  price: "$50.00/Day",
  numericPrice: 50,
  img: "https://via.placeholder.com/600x400.png?text=Car+Image",
  rating: 5,
  transmission: "Automatic",
  seats: 4,
  fuelType: "Petrol",
  available: true,
  category: "Sedan",
  mileage: "15 km/L",
  reviews: 0,
};

export default function CarAddEdit({ params }: { params: Promise<{ id: string }> }) {
  // --- Next.js 15 Fix: Unwrap params Promise ---
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const isAddMode = id === "add";

  const [activeTab, setActiveTab] = useState<"details" | "pricing" | "specs" | "features">("details");
  const [car, setCar] = useState<Car>(initialCarState);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(""); 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialCarState.img);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'description') {
        setDescription(value);
        return;
    }
    
    const updatedValue: any = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : (['year', 'seats', 'rating', 'reviews'].includes(name)
            ? Number(value) 
            : value);

    setCar(prev => ({
        ...prev,
        [name]: updatedValue,
    }));
  };

  // Fetch Car Data for Edit Mode
  useEffect(() => {
    if (!isAddMode) {
      const fetchCar = async () => {
        setLoading(true);
        try {
          const response = await axiosConfig().get(`/cars/${id}`);
          const data = response.data.data || response.data;
          
          setCar(data);
          setImagePreview(data.img || initialCarState.img);
          setDescription((data as any).description || ""); 

        } catch (error) {
          console.error("Error fetching car:", error);
          handleAxiosError(error);
          router.push("/admin/car");
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id, isAddMode, router]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id: _, ...carDataWithoutId } = car;

      const payload: any = {
          ...carDataWithoutId,
          numericPrice: typeof car.price === 'string' ? parseFloat(car.price.replace(/[^0-9.]/g, '')) : car.price,
          description: description, 
          img: imagePreview, 
      };

      if (isAddMode) {
        await axiosConfig().post(`/cars`, payload);
      } else {
        await axiosConfig().put(`/cars/${id}`, payload);
      }

      router.push("/admin/car");
      router.refresh();
    } catch (error: any) {
      const errorMessage = handleAxiosError(error);
      if (error.response?.status === 403) {
        alert("Access Denied (403): Please ensure you are logged in as an Admin. If you recently updated permissions, please logout and log back in to refresh your token.");
      } else {
        alert(`Error saving car: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(initialCarState.img);
    setCar(prev => ({...prev, img: initialCarState.img})); 
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isAddMode && loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="animate-spin h-8 w-8 inline mr-2 text-red-600" />
        <span className="text-gray-600 font-medium">Loading Car Details...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAddMode ? "Add New Car" : `Edit Car: ${car.name} ${car.model}`}
        </h1>
        <Link
          href="/admin/car"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Cars</span>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: "details", icon: <CarIcon size={18} />, label: "Identity & Image" },
            { id: "pricing", icon: <DollarSign size={18} />, label: "Pricing & Status" },
            { id: "specs", icon: <User size={18} />, label: "Specs" },
            { id: "features", icon: <List size={18} />, label: "Features" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 py-4 px-1 font-medium text-base transition-colors ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-red-600"
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg">
        {/* --- Tab 1: Identity & Image --- */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Car Name / Make</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 text-gray-900"
                  value={car.name}
                  onChange={handleChange}
                  placeholder="Toyota"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Model</label>
                <input
                  type="text"
                  name="model"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 text-gray-900"
                  value={car.model}
                  onChange={handleChange}
                  placeholder="Corolla"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Year</label>
                <input
                  type="number"
                  name="year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 text-gray-900"
                  value={car.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Car Description (for admin reference/SEO)</label>
              <textarea
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 text-gray-900"
                rows={4}
                value={description}
                onChange={handleChange}
                placeholder="Detailed features, condition, and selling points..."
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Featured Image (`img` field)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative group">
                <div className="space-y-1 text-center w-full">
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  
                  {imagePreview === initialCarState.img ? (
                    /* EMPTY STATE: Proper Upload Option */
                    <div className="flex flex-col items-center cursor-pointer py-4" onClick={triggerFileInput}>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium text-red-600 hover:text-red-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  ) : (
                    /* POPULATED STATE: Option to Change or Remove */
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-64 mx-auto object-cover rounded-md shadow-sm" />
                      
                      {/* Hover Overlay for Changing/Removing */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-md">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 flex items-center gap-2"
                        >
                          <ImageIcon size={16} /> Change
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-700 flex items-center gap-2"
                        >
                          <X size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Pricing & Status --- */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Price (`price` field)</label>
                <input type="text" name="price" className="w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300" value={car.price} onChange={handleChange} placeholder="e.g., $50/Day" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Original Price (Optional)</label>
                <input type="text" name="originalPrice" className="w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300" value={car.originalPrice || ""} onChange={handleChange} placeholder="e.g., $75/Day" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Discount (Optional)</label>
                <input type="text" name="discount" className="w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300" value={car.discount || ""} onChange={handleChange} placeholder="e.g., 20% OFF" />
              </div>
            </div>
            <h3 className="text-lg font-medium pt-4 text-gray-900">Status Settings</h3>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="available" className="sr-only peer" checked={car.available} onChange={handleChange} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  <CheckCircle size={16} className="inline-block mr-1 text-green-600" />
                  Available for Booking (`available` field)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* --- Tab 3: Specs --- */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900"><User size={16} className="inline-block mr-1" /> Passenger Capacity (`seats` field)</label>
                <input type="number" name="seats" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.seats} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Transmission Type</label>
                <select name="transmission" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.transmission} onChange={handleChange}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Fuel Type</label>
                <input type="text" name="fuelType" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.fuelType} onChange={handleChange} placeholder="Petrol, Diesel, etc." required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                <input type="text" name="category" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.category} onChange={handleChange} placeholder="Sedan, SUV, etc." required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Mileage</label>
                <input type="text" name="mileage" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.mileage} onChange={handleChange} placeholder="15 km/L" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Rating (1-5)</label>
                <input type="number" name="rating" step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900" value={car.rating} onChange={handleChange} required />
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 4: Features --- */}
        {activeTab === "features" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Enter a comma-separated list of features (e.g., 'AC, GPS, Bluetooth').</p>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              rows={4}
              value={car.features.join(', ')}
              onChange={(e) => setCar(prev => ({ 
                ...prev, 
                features: e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0)
              }))}
              placeholder="E.g., AC, GPS Navigation, Sunroof"
            />
            <h4 className="font-medium text-sm mt-4 text-gray-900">Current Features:</h4>
            <div className="flex flex-wrap gap-2">
              {car.features.map((f, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{f}</span>
              ))}
              {car.features.length === 0 && <span className="text-gray-500 text-sm">No features added yet.</span>}
            </div>
          </div>
        )}

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 font-semibold text-white rounded-md transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : isAddMode ? "Create Car" : "Update Car"}
          </button>
        </div>
      </form>
    </div>
  );
}