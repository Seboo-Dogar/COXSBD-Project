"use client";

import { Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ManageVisaFromCountries from "@/components/admin/visa-from-country/ManageVisaFromCountries";
import ManageVisaToCountries from "@/components/admin/visa-to-country/ManageVisaToCountries";

export default function VisaCountriesPage() {
  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-red-600" />
          Visa Countries
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Tabs defaultValue="from-countries" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="from-countries">From Countries</TabsTrigger>
            <TabsTrigger value="to-countries">To Countries</TabsTrigger>
          </TabsList>

          <TabsContent value="from-countries" className="mt-6">
            <ManageVisaFromCountries />
          </TabsContent>

          <TabsContent value="to-countries" className="mt-6">
            <ManageVisaToCountries />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
