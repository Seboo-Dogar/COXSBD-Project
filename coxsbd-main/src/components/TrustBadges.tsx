import React from "react";
import { ShieldCheck, TruckIcon, BadgeCheck, CreditCard } from "lucide-react";

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <ShieldCheck size={28} className="text-blue-600" />,
      title: "Trade Assurance",
      description: "Order protection from payment to delivery",
    },
    {
      icon: <TruckIcon size={28} className="text-green-600" />,
      title: "On-time Shipping",
      description: "Guaranteed delivery times from verified suppliers",
    },
    {
      icon: <BadgeCheck size={28} className="text-purple-600" />,
      title: "Quality Inspection",
      description: "Pre-shipment product verification and quality checks",
    },
    {
      icon: <CreditCard size={28} className="text-orange-600" />,
      title: "Secure Payments",
      description: "Multiple secure payment methods with protection",
    },
  ];

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-full xl:max-w-[1280px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition duration-200"
            >
              <div className="mb-3">{badge.icon}</div>
              <h3 className="font-medium text-base mb-2">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
