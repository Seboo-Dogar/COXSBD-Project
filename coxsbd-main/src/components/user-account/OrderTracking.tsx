"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Shipment = {
  id: string;
  from: string;
  to: string;
  steps: number;
  product: string;
  price: string;
  image: string;
};

const stepLabels = ["Packing", "In Country", "In City", "Arrived"];

export default function OrderTracking() {
  const shipments: Shipment[] = [
    {
      id: "95 259105",
      from: "Berlin",
      to: "Dortmund",
      steps: 0,
      product: "AirPods Pro",
      price: "$249.00",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231691?q=80&w=300",
    },
    {
      id: "92 937467",
      from: "Berlin",
      to: "Dortmund",
      steps: 2,
      product: "iPhone 11",
      price: "$730.00",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4 max-w-md mx-auto">
      {shipments.map((item) => (
        <Card key={item.id} className="rounded-2xl shadow-sm">
          <CardContent className="p-4 space-y-4">
            {/* ID */}
            <p className="text-sm text-gray-500">ID: {item.id}</p>

            {/* From → To */}
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-400">15 Dec, 19</p>
                <p className="font-semibold">{item.from}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">20 Dec, 19</p>
                <p className="font-semibold">{item.to}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex-1 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2
                      className={`h-5 w-5 ${
                        i <= item.steps ? "text-green-500" : "text-gray-300"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Product */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.product}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium leading-tight">{item.product}</p>
                  <p className="text-xs text-gray-400">White Color</p>
                </div>
              </div>

              <p className="font-semibold text-blue-600">{item.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
