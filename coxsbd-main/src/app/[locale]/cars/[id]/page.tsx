"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Fuel,
  Zap,
  Clock,
  Star,
  Shield,
  Heart,
  Car,
  Gauge,
  Snowflake,
  Wifi,
  Music,
  Phone,
  AlertCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data - in a real app, this would come from an API
const carData = {
  _id: "1",
  name: "Toyota Corolla",
  brand: "Toyota",
  pricePerDay: 40,
  description:
    "Comfortable 5-seater sedan, perfect for city and long drives. Features advanced safety systems, fuel-efficient engine, and modern infotainment system with Apple CarPlay and Android Auto.",
  images: [
    "/images/car.png",
    "/images/car.png",
    "/images/car.png",
    "/images/car.png",
  ],
  seats: 5,
  fuel: "Petrol",
  transmission: "Automatic",
  mileage: "Unlimited",
  features: [
    "Air Conditioning",
    "Bluetooth",
    "Navigation",
    "Backup Camera",
    "Keyless Entry",
  ],
  location: "Downtown Rental Office",
  rating: 4.8,
  reviews: 142,
  insurance: "Full coverage included",
  minimumRentalDays: 1,
  available: true,
  specifications: {
    engine: "1.8L 4-cylinder",
    horsepower: 139,
    fuelEfficiency: "33 MPG combined",
    luggage: "13 cu ft",
    doors: 4,
    year: 2023,
  },
  policies: [
    "Minimum rental age: 21 years",
    "Security deposit: $200 (refundable)",
    "Free cancellation up to 24 hours before rental",
    "Additional driver: $10/day",
  ],
};

// Related cars for recommendation section
const relatedCars = [
  {
    id: 2,
    name: "Honda Civic",
    brand: "Honda",
    pricePerDay: 42,
    image: "/images/car.png",
    transmission: "Automatic",
    seats: 5,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Hyundai Elantra",
    brand: "Hyundai",
    pricePerDay: 38,
    image: "/images/car.png",
    transmission: "Automatic",
    seats: 5,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Mazda 3",
    brand: "Mazda",
    pricePerDay: 45,
    image: "/images/car.png",
    transmission: "Automatic",
    seats: 5,
    rating: 4.9,
  },
];

// Sample reviews data
const reviewsData = [
  {
    id: 1,
    user: "Michael Johnson",
    rating: 5,
    date: "2 weeks ago",
    comment: "Perfect car for our road trip. Comfortable and fuel-efficient.",
  },
  {
    id: 2,
    user: "Sarah Williams",
    rating: 4,
    date: "1 month ago",
    comment: "Good experience overall. The pickup process was quick and easy.",
  },
  {
    id: 3,
    user: "David Chen",
    rating: 5,
    date: "3 weeks ago",
    comment: "Will definitely rent again. The car was in excellent condition.",
  },
];

export default function CarDetailsPage() {
  const { id } = useParams();
const carId = Array.isArray(id) ? id[0] : id || carData._id;

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(carData.pricePerDay);
  const [activeTab, setActiveTab] = useState("overview");
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const { addToCart } = useCart();
  

  // Calculate total price based on days
  useEffect(() => {
    if (bookingDates.start && bookingDates.end) {
      const start = new Date(bookingDates.start);
      const end = new Date(bookingDates.end);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays || 1);
      setTotalPrice(carData.pricePerDay * (diffDays || 1));
    }
  }, [bookingDates]);


 const handleAddToCart = () => {
  addToCart(
    {
      id: carId, // ✅ always a string now
      name: carData.name,
      price: carData.pricePerDay,
      image: carData.images[0],
    },
    days
  );
  alert(`${carData.name} added to cart!`);
};


  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would send data to your backend
    alert(`Booking confirmed for ${days} days! Total: $${totalPrice}`);
    setShowBookingModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would update user preferences in the backend
  };

  const navigateToCar = (carId: string) => {
    router.push(`/cars/${carId}`);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "next") {
      setSelectedImage((prev) =>
        prev === carData.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImage((prev) =>
        prev === 0 ? carData.images.length - 1 : prev - 1
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="hover:text-red-600 transition-colors"
              >
                Home
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => router.push("/cars")}
                className="hover:text-red-600 transition-colors"
              >
                Cars
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-red-600">{carData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div
              className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4 cursor-zoom-in"
              onClick={() => setImageViewerOpen(true)}
            >
              <Image
                src={carData.images[selectedImage]}
                alt={carData.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
              {!carData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {selectedImage + 1} / {carData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {carData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${carData.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {carData.name}
                </h1>
                <p className="text-gray-500 text-lg">{carData.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">
                  ${carData.pricePerDay}
                  <span className="text-base font-normal text-gray-500">
                    /day
                  </span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{carData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {carData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{carData.location}</span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {["overview", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "text-red-600 border-b-2 border-red-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === "overview" && (
                <div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {carData.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {carData.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Gauge className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Engine</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.engine}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Zap className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Horsepower</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.horsepower} HP
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Fuel className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Fuel Efficiency</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.fuelEfficiency}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Car className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Luggage Capacity</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.luggage}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Doors</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.doors}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium">Year</span>
                    </div>
                    <p className="text-gray-700">
                      {carData.specifications.year}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviewsData.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-0"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-medium">{review.user}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500 text-sm">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBookNow}
                disabled={!carData.available}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {carData.available ? "Rent Now" : "Not Available"}
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            {/* Policies */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold mb-2 flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Rental Policies
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {carData.policies.map((policy, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Cars Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCars.map((car) => (
              <motion.div
                key={car.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToCar(car.id.toString())}
              >
                <div className="relative h-48">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <p className="text-gray-500">{car.brand}</p>
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(car.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      {car.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{car.seats}</span>
                      <span className="mx-2">•</span>
                      <Zap className="w-4 h-4 mr-1" />
                      <span>{car.transmission}</span>
                    </div>
                    <p className="text-red-600 font-bold">
                      ${car.pricePerDay}/day
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Image Viewer Modal */}
        <AnimatePresence>
          {imageViewerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
              <div className="relative max-w-4xl w-full max-h-full">
                <button
                  onClick={() => setImageViewerOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="relative h-96 md:h-[80vh]">
                  <Image
                    src={carData.images[selectedImage]}
                    alt={carData.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="flex gap-2">
                    {carData.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-3 h-3 rounded-full ${
                          selectedImage === idx ? "bg-white" : "bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">Book {carData.name}</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={bookingDates.start}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          start: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={bookingDates.end}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          end: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg"
                      min={
                        bookingDates.start ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>
                      ${carData.pricePerDay} × {days} days
                    </span>
                    <span>${carData.pricePerDay * days}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
