"use client";

import Image from "next/image";
import {
  CreditCard,
  ClipboardList,
  MapPin,
  BarChart3,
  Wrench,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PhoneDashboard() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
      {/* Profile Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Image
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
          alt="Profile"
          width={44}
          height={44}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-800">Al Amin</h2>
        </div>
      </div>

      {/* Top Stats Section */}
      <div className="bg-indigo-600 text-white p-4 rounded-b-3xl">
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatBox title="Discount" value="10%" />
          <StatBox title="Balance" value="$32" />
          <StatBox title="Deposit" value="$70" />
        </div>
      </div>

      {/* Grid Menu */}
      <CardContent className="grid grid-cols-3 gap-6 py-6">
        <MenuItem
          icon={<ClipboardList className="h-7 w-7 text-green-500" />}
          label="Orders History"
        />
        <MenuItem
          icon={<CreditCard className="h-7 w-7 text-blue-500" />}
          label="Payment Method"
        />
        <MenuItem
          icon={<MapPin className="h-7 w-7 text-emerald-500" />}
          label="Tracking"
        />
        <MenuItem
          icon={<BarChart3 className="h-7 w-7 text-purple-500" />}
          label="Statistics"
        />
        <MenuItem
          icon={<Wrench className="h-7 w-7 text-gray-500" />}
          label="Settings"
        />
        <MenuItem
          icon={<LifeBuoy className="h-7 w-7 text-teal-500" />}
          label="Support"
        />
        <MenuItem
          icon={<BarChart3 className="h-7 w-7 text-purple-500" />}
          label="Hotels"
        />
        <MenuItem
          icon={<Wrench className="h-7 w-7 text-gray-500" />}
          label="Cars"
        />
        <MenuItem
          icon={<LifeBuoy className="h-7 w-7 text-teal-500" />}
          label="Flights"
        />
      </CardContent>
    </div>
  );
}

function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-indigo-500 border-none text-white rounded-xl">
      <CardContent className="p-3">
        <p className="text-xs opacity-80">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}
