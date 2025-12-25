"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Hotel,
  Mail,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Bed,
  X,
  ImageIcon,
} from "lucide-react";
import { Map, Marker } from "pigeon-maps";
import { useParams, useRouter } from "next/navigation";
import axiosConfig, { handleAxiosError } from "@/utils/axiosConfig";
import { BASE_API_URL } from "@/utils/config";

export default function HotelAddEdit() {
  const { id } = useParams();
  const isAddMode = id === "add";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "details" | "contacts" | "rooms" | "location"
  >("details");
  const [hotelDetails, setHotelDetails] = useState({
    name: "",
    location: {
      name: "",
      lat: 23.685, // Default to Bangladesh coordinates
      lng: 90.3563,
    },
    description: "",
    stars: 3,
    featuredImage:
      "https://th.bing.com/th/id/OIP.Zis2cXdglxbZemS3QNsdZQHaE8?w=5000&h=3337&rs=1&pid=ImgDetMain",
    gallery: [
      "https://th.bing.com/th/id/OIP.Zis2cXdglxbZemS3QNsdZQHaE8?w=5000&h=3337&rs=1&pid=ImgDetMain",
    ],
    enabled: true,
    featured: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [contacts, setContacts] = useState({
    email: "",
    phone: "",
    website: "",
    facebook: "",
    twitter: "",
  });

  type Room = {
    id: string | null | undefined;
    type: string;
    description: string;
    price: string;
    capacity: number;
    currency: string;
    amenities: string[];
  };

  const [rooms, setRooms] = useState<Room[]>([
    {
      type: "",
      description: "",
      price: "",
      capacity: 2,
      currency: "BDT",
      amenities: [],
      id: undefined,
    },
  ]);

  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = {
      BDT: "৳",
      USD: "$",
      EUR: "€",
      INR: "₹",
      GBP: "£",
    };
    return symbols[currencyCode] || "$";
  };

  const currencyOptions = [
    { code: "BDT", label: "Bangladeshi Taka (৳)" },
    { code: "USD", label: "US Dollar ($)" },
    { code: "EUR", label: "Euro (€)" },
    { code: "INR", label: "Indian Rupee (₹)" },
    { code: "GBP", label: "British Pound (£)" },
    // Add more as needed
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  useEffect(() => {
    console.log("is add mode: ", isAddMode);
    if (!isAddMode) {
      const fetchHotel = async () => {
        try {
          const response = await axiosConfig().get(
            `${BASE_API_URL}/hotels/${id}`
          );
          const data = response.data;

          setHotelDetails({
            name: data.name,
            description: data.description,
            stars: data.stars,
            featuredImage: data.featuredImage,
            gallery: data.gallery,
            enabled: data.enabled,
            featured: data.featured,
            location: {
              name: data.locationName,
              lat: data.lat,
              lng: data.lng,
            },
          });

          setContacts({
            email: data.email,
            phone: data.phone,
            website: data.website || "",
            facebook: data.facebook || "",
            twitter: data.twitter || "",
          });

          setRooms(
            data.rooms.map((room: any) => ({
              id: room.id,
              type: room.type,
              description: room.description,
              price: room.price.toString(),
              capacity: room.capacity,
              currency: room.currency,
              amenities: room.amenities,
            }))
          );
        } catch (error) {
          console.error("Error fetching hotel:", error);
          router.push("/admin/hotel");
        }
      };
      fetchHotel();
    }
  }, [id, isAddMode, router]);

  const handleSelectResult = (result: any) => {
    setHotelDetails({
      ...hotelDetails,
      location: {
        name: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: hotelDetails.name,
        description: hotelDetails.description,
        stars: hotelDetails.stars,
        featuredImage: hotelDetails.featuredImage,
        gallery: hotelDetails.gallery,
        enabled: hotelDetails.enabled,
        featured: hotelDetails.featured,
        locationName: hotelDetails.location.name,
        lat: hotelDetails.location.lat,
        lng: hotelDetails.location.lng,
        email: contacts.email,
        phone: contacts.phone,
        website: contacts.website,
        facebook: contacts.facebook,
        twitter: contacts.twitter,
        rooms: rooms.map((room) => ({
          ...room,
          price: parseFloat(room.price),
        })),
      };

      console.log("Hotel details:", payload);

      if (isAddMode) {
        await axiosConfig().post(`${BASE_API_URL}/hotels`, payload);
      } else {
        await axiosConfig().put(`${BASE_API_URL}/hotels/${id}`, payload);
      }

      router.push("/admin/hotel");
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      alert(`Error saving hotel: ${errorMessage}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        type: "",
        description: "",
        price: "",
        capacity: 2,
        currency: "BDT",
        amenities: [],
        id: undefined,
      },
    ]);
  };

  // Update removeRoom function to handle API deletion
  const removeRoom = async (index: number) => {
    const room = rooms[index];
    if (!room.id) {
      const newRooms = [...rooms];
      newRooms.splice(index, 1);
      setRooms(newRooms);
      return;
    }

    try {
      await axiosConfig().delete(`/rooms/${room.id}`);
      const newRooms = [...rooms];
      newRooms.splice(index, 1);
      setRooms(newRooms);
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      alert(`Error deleting room: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAddMode ? "Add New Hotel" : "Edit Hotel"}
        </h1>
        <Link
          href="/admin/hotel"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Hotels</span>
        </Link>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { id: "details", icon: <Hotel size={18} />, label: "Details" },
            { id: "contacts", icon: <Mail size={18} />, label: "Contacts" },
            { id: "rooms", icon: <Bed size={18} />, label: "Rooms" },
            { id: "location", icon: <MapPin size={18} />, label: "Location" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 py-4 px-1 font-medium text-base transition-colors ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-red-600"
              }`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg">
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Hotel Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={hotelDetails.name}
                  onChange={(e) =>
                    setHotelDetails({ ...hotelDetails, name: e.target.value })
                  }
                  placeholder="Enter hotel name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-gray-900"
                  value={hotelDetails.location.name}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                rows={4}
                value={hotelDetails.description}
                onChange={(e) =>
                  setHotelDetails({
                    ...hotelDetails,
                    description: e.target.value,
                  })
                }
                placeholder="Enter hotel description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Star Rating
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={hotelDetails.stars}
                  onChange={(e) =>
                    setHotelDetails({
                      ...hotelDetails,
                      stars: Number(e.target.value),
                    })
                  }
                >
                  {[3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Featured Image URL (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={hotelDetails.featuredImage}
                  onChange={(e) =>
                    setHotelDetails({
                      ...hotelDetails,
                      featuredImage: e.target.value,
                    })
                  }
                  placeholder="Enter image URL (if not uploading)"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Upload Hotel Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {!imagePreview ? (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Click to upload
                        </button>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Hotel preview"
                        className="h-64 mx-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hotelDetails.enabled}
                    onChange={(e) =>
                      setHotelDetails({
                        ...hotelDetails,
                        enabled: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Enabled
                  </span>
                </label>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hotelDetails.featured}
                    onChange={(e) =>
                      setHotelDetails({
                        ...hotelDetails,
                        featured: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Featured
                  </span>
                </label>
              </div>
            </div>

            {!imagePreview && hotelDetails.featuredImage && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Current Image
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg">
                    <img
                      src={hotelDetails.featuredImage || "/placeholder.svg"}
                      alt="Hotel preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900">
                  <Mail size={16} className="text-gray-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={contacts.email}
                  onChange={(e) =>
                    setContacts({ ...contacts, email: e.target.value })
                  }
                  placeholder="hotel@example.com"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900">
                  <Phone size={16} className="text-gray-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={contacts.phone}
                  onChange={(e) =>
                    setContacts({ ...contacts, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900">
                  <Globe size={16} className="text-gray-500" />
                  Website
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={contacts.website}
                  onChange={(e) =>
                    setContacts({ ...contacts, website: e.target.value })
                  }
                  placeholder="https://www.example.com"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900">
                  <Facebook size={16} className="text-gray-500" />
                  Facebook
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={contacts.facebook}
                  onChange={(e) =>
                    setContacts({ ...contacts, facebook: e.target.value })
                  }
                  placeholder="https://facebook.com/hotelname"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-900">
                  <Twitter size={16} className="text-gray-500" />
                  Twitter
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  value={contacts.twitter}
                  onChange={(e) =>
                    setContacts({ ...contacts, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/hotelname"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Bed size={20} className="text-red-600" />
                    Room {index + 1}
                  </h3>
                  {rooms.length > 1 && (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => removeRoom(index)}
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Currency
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      value={room.currency}
                      onChange={(e) => {
                        const newRooms = [...rooms];
                        newRooms[index].currency = e.target.value;
                        setRooms(newRooms);
                      }}
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Price per Night
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        {getCurrencySymbol(room.currency)}
                      </span>
                      <input
                        type="number"
                        className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                        value={room.price}
                        onChange={(e) => {
                          const newRooms = [...rooms];
                          newRooms[index].price = e.target.value;
                          setRooms(newRooms);
                        }}
                        placeholder="99.99"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Room Type
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      value={room.type}
                      onChange={(e) => {
                        const newRooms = [...rooms];
                        newRooms[index].type = e.target.value;
                        setRooms(newRooms);
                      }}
                      placeholder="Deluxe, Standard, Suite, etc."
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Capacity
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      value={room.capacity}
                      onChange={(e) => {
                        const newRooms = [...rooms];
                        newRooms[index].capacity = Number(e.target.value);
                        setRooms(newRooms);
                      }}
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Amenities (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                      value={room.amenities.join(", ")}
                      onChange={(e) => {
                        const newRooms = [...rooms];
                        newRooms[index].amenities = e.target.value
                          .split(",")
                          .map((a) => a.trim());
                        setRooms(newRooms);
                      }}
                      placeholder="WiFi, TV, Air Conditioning, Mini Bar"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                    rows={3}
                    value={room.description}
                    onChange={(e) => {
                      const newRooms = [...rooms];
                      newRooms[index].description = e.target.value;
                      setRooms(newRooms);
                    }}
                    placeholder="Describe the room features and amenities"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              onClick={addRoom}
            >
              <Plus size={18} />
              <span>Add Room</span>
            </button>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                District/Area Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                value={hotelDetails.location.name}
                onChange={(e) =>
                  setHotelDetails({
                    ...hotelDetails,
                    location: {
                      ...hotelDetails.location,
                      name: e.target.value,
                    },
                  })
                }
                placeholder="Enter district/area name"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded-lg p-2 max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onClick={() => handleSelectResult(result)}
                    >
                      {result.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-96 rounded-lg overflow-hidden">
              <Map
                center={[hotelDetails.location.lat, hotelDetails.location.lng]}
                zoom={12}
                onClick={({ latLng }) => {
                  setHotelDetails({
                    ...hotelDetails,
                    location: {
                      ...hotelDetails.location,
                      lat: latLng[0],
                      lng: latLng[1],
                    },
                  });
                }}
              >
                <Marker
                  anchor={[
                    hotelDetails.location.lat,
                    hotelDetails.location.lng,
                  ]}
                />
              </Map>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            {isAddMode ? "Create Hotel" : "Update Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
}
