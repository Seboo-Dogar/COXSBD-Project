import React from "react";
import { Star, Clock, Armchair, ShieldCheck, ChevronRight } from "lucide-react";
import { BusTrip } from "@/lib/bus-utils";

interface TripCardProps {
  trip: BusTrip;
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          {/* Operator Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {trip.operator}
              </h3>
              <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-sm">
                <span>{trip.rating}</span>
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs uppercase font-medium">{trip.busType}</span>
              <span className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                <ShieldCheck size={14} /> Travel Safe
              </span>
            </p>

            {/* Timeline */}
            <div className="flex items-center justify-between max-w-sm relative">
              <div className="z-10 bg-white">
                <p className="text-xl font-black text-gray-900">{trip.departureTime}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Departure</p>
              </div>

              <div className="flex-1 flex flex-col items-center px-4 relative">
                <span className="text-[10px] font-bold text-gray-400 mb-1">{trip.duration}</span>
                <div className="w-full h-[1px] bg-dashed bg-gray-200 border-t border-dashed relative">
                   <div className="absolute -top-[3px] left-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                   <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
              </div>

              <div className="z-10 bg-white text-right">
                <p className="text-xl font-black text-gray-900">{trip.arrivalTime}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Arrival</p>
              </div>
            </div>
          </div>

          {/* Pricing & Action */}
          <div className="flex flex-row md:flex-col justify-between md:items-end md:justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
            <div className="md:text-right">
              <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">₹</span>
                <span className="text-2xl font-black text-gray-900">{trip.pricePerSeat}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <Armchair size={14} /> {trip.availableSeats} Seats Left
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 group-hover:translate-x-1 shadow-lg shadow-red-100">
                Select Seat
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Amenities Footer */}
      <div className="bg-gray-50 px-5 py-2 flex items-center gap-4 overflow-x-auto border-t border-gray-50">
        <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Amenities:</span>
        <div className="flex items-center gap-3">
          {["Water Bottle", "Blankets", "Charging Point", "Reading Light"].map((item) => (
             <span key={item} className="text-[10px] text-gray-500 whitespace-nowrap">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}