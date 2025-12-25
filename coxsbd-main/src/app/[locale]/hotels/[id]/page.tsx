"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Wifi,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  Waves,
  MassageSquare, // Importing a Lucide icon for Spa/Wellness
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { GiPoolDive } from "react-icons/gi";
import { FaSpa } from "react-icons/fa"; // Importing FaSpa for better spa representation
import { useCart } from "@/context/cartContext";

// Mock data for hotel
const hotelData = {
  _id: "1",
  name: "Grand Luxury Resort & Spa",
  chain: "Luxury Collection",
  pricePerNight: 199,
  description:
    "5-star beachfront resort with panoramic ocean views, premium amenities, and exceptional service. Features multiple pools, gourmet restaurants, and a world-class spa for the ultimate luxury experience.",
  images: [
    "/images/hotel.jpg",
    "/images/hotel.jpg",
    "/images/hotel.jpg",
    "/images/hotel.jpg",
  ],
  rating: 4.8,
  reviews: 342,
  location: "Maldives Beachfront",
  amenities: [
    "Free WiFi",
    "Swimming Pool",
    "Spa & Wellness Center", // Targeting this amenity
    "Fitness Center",
    "Restaurant & Bar",
    "Room Service",
    "Beach Access",
    "Air Conditioning",
    "TV with Cable",
    "Ocean View",
    "Private Balcony",
    "Minibar",
  ],
  roomTypes: [
    "Deluxe King Room",
    "Ocean View Suite",
    "Beachfront Villa",
    "Presidential Suite"
  ],
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",
  available: true,
  sustainability: "Green Certified",
  airportDistance: "20 km",
};

// Related hotels for recommendation section
const relatedHotels = [
  {
    id: 2,
    name: "Ocean Paradise Resort",
    chain: "Premium Collection",
    pricePerNight: 175,
    image: "/images/hotel.jpg",
    rating: 4.6,
    location: "Beachfront",
  },
  {
    id: 3,
    name: "City Center Hotel",
    chain: "Business Class",
    pricePerNight: 129,
    image: "/images/hotel.jpg",
    rating: 4.4,
    location: "Downtown",
  },
  {
    id: 4,
    name: "Mountain Retreat Lodge",
    chain: "Nature Collection",
    pricePerNight: 159,
    image: "/images/hotel.jpg",
    rating: 4.7,
    location: "Mountain View",
  },
];

export default function HotelDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({ checkIn: "", checkOut: "" });
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(2);
  const [totalPrice, setTotalPrice] = useState(hotelData.pricePerNight);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { addToCart } = useCart();
  
  // Calculate total price based on nights
  useEffect(() => {
    // Only calculate if both dates are set
    if (bookingDates.checkIn && bookingDates.checkOut) {
      const checkInDate = new Date(bookingDates.checkIn);
      const checkOutDate = new Date(bookingDates.checkOut);

      // Reset nights and price if checkOut is before checkIn
      if (checkOutDate <= checkInDate) {
         setNights(1);
         setTotalPrice(hotelData.pricePerNight);
         return;
      }
      
      // Calculate difference in milliseconds
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      // Convert milliseconds to days (nights)
      const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setNights(diffNights);
      setTotalPrice(hotelData.pricePerNight * diffNights);
    } else {
        // Default to 1 night price if dates are not fully selected
        setNights(1);
        setTotalPrice(hotelData.pricePerNight);
    }
  }, [bookingDates]);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleAddToCart = () => {
    // Add logic to ensure dates are selected before adding to cart with a proper night count
    if (!bookingDates.checkIn || !bookingDates.checkOut || nights < 1) {
        alert("Please select valid Check-in and Check-out dates before adding to cart.");
        setShowBookingModal(true); // Prompt the user to enter dates
        return;
    }
    
    addToCart({
      id: hotelData._id,
      name: hotelData.name,
      price: totalPrice,
      image: hotelData.images[0],
      nights,
      guests,
      checkInDate: bookingDates.checkIn,
      checkOutDate: bookingDates.checkOut,
    });

    alert(`${hotelData.name} for ${nights} nights added to cart!`);
  };

  const handleConfirmBooking = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut || nights < 1) {
        alert("Please select valid Check-in and Check-out dates.");
        return;
    }
    
    alert(`Hotel booking confirmed for ${nights} nights! Total: $${totalPrice}`);
    setShowBookingModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const navigateToHotel = (hotelId: string) => {
    router.push(`/hotels/${hotelId}`);
  };

  // --- FIX 1: Use a professional Spa icon (FaSpa) instead of MdOutlineSystemSecurityUpdateWarning ---
  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('WiFi')) return <Wifi className="w-4 h-4 mr-1" />;
    if (amenity.includes('Pool')) return <GiPoolDive className="w-4 h-4 mr-1" />;
    // FIX: Replaced incorrect icon with FaSpa
    if (amenity.includes('Spa')) return <FaSpa className="w-4 h-4 mr-1" />;
    if (amenity.includes('Fitness')) return <Dumbbell className="w-4 h-4 mr-1" />;
    if (amenity.includes('Restaurant')) return <Utensils className="w-4 h-4 mr-1" />;
    if (amenity.includes('Air Conditioning')) return <Snowflake className="w-4 h-4 mr-1" />;
    if (amenity.includes('TV')) return <Tv className="w-4 h-4 mr-1" />;
    if (amenity.includes('Beach')) return <Waves className="w-4 h-4 mr-1" />;
    if (amenity.includes('Room Service') || amenity.includes('Minibar')) return <Utensils className="w-4 h-4 mr-1" />; // Added icons for more common amenities
    return <Star className="w-4 h-4 mr-1" />;
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => router.push("/")} className="hover:text-red-600">Home</button>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              {/* FIX: Corrected router push to /hotels for consistency */}
              <button onClick={() => router.push("/hotels/search")} className="hover:text-red-600">Hotels Search</button> 
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-red-600">{hotelData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={hotelData.images[selectedImage]}
                alt={hotelData.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              {!hotelData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {hotelData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {hotelData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`${hotelData.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{hotelData.name}</h1>
                <p className="text-gray-500 text-lg">{hotelData.chain}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">
                  ${hotelData.pricePerNight}
                  <span className="text-base font-normal text-gray-500">/night</span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{hotelData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">{hotelData.reviews} reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{hotelData.location}</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{hotelData.description}</p>

            {/* Hotel Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">{hotelData.checkIn}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">{hotelData.checkOut}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Airport Distance</p>
                <p className="font-medium">{hotelData.airportDistance}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Sustainability</p>
                <p className="font-medium">{hotelData.sustainability}</p>
              </div>
            </div>

            {/* Room Types */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Room Types</h3>
              <div className="flex flex-wrap gap-2">
                {hotelData.roomTypes.map((room, index) => (
                  <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    {room}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Amenities</h3>
                <button 
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {showAllAmenities ? "Show less" : "Show all"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {hotelData.amenities.slice(0, showAllAmenities ? hotelData.amenities.length : 8).map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBookNow}
                disabled={!hotelData.available}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {hotelData.available ? "Book Now" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Hotels Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToHotel(hotel.id.toString())}
              >
                <div className="relative h-48">
                  <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                  <p className="text-gray-500">{hotel.chain}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">{hotel.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{hotel.location}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500"></span>
                    <p className="text-red-600 font-bold">${hotel.pricePerNight}/night</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

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
                <h2 className="text-2xl font-bold mb-4">Book {hotelData.name}</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={bookingDates.checkIn}
                      onChange={(e) => setBookingDates({...bookingDates, checkIn: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={bookingDates.checkOut}
                      onChange={(e) => setBookingDates({...bookingDates, checkOut: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      // Enforce check-out is after check-in
                      min={bookingDates.checkIn || new Date().toISOString().split('T')[0]} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full p-3 border rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>${hotelData.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${hotelData.pricePerNight * nights}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Taxes & fees</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
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
                    disabled={!bookingDates.checkIn || !bookingDates.checkOut || nights < 1}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}