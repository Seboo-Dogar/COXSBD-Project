"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import AnalyticsCard from "@/components/user-account/AnalyticsCard";
import SecondRow from "@/components/user-account/SecondRow";
import ThirdRow from "@/components/user-account/ThirdRow";
import PhoneDashboard from "@/components/user-account/PhoneDashboard";
import OrderTracking from "@/components/user-account/OrderTracking";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="md:hidden sm:block ">
        <PhoneDashboard />
      </div>

      {/* Main container with padding and max-width for large screens */}
      <div className=" hidden md:block px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats Grid - First Row */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <AnalyticsCard />
          {/* If AnalyticsCard is only one, duplicate or adjust */}
          {/* Example: add more cards or make it full width if needed */}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SecondRow />
        </div>

        {/* Third Row - likely full width */}
        <div className="mb-6">
          <ThirdRow />
        </div>
      </div>
    </div>
  );
}
