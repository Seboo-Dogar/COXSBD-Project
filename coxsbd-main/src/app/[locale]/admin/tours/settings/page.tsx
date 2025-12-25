"use client";

import { Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ManageTourTypes from "@/components/admin/tour-type/ManageTourTypes";
import ManageTourInclusions from "@/components/admin/tour-inclusion/ManageTourInclusions";
import ManageTourExclusions from "@/components/admin/tour-exclusion/ManageTourExclusions";

export default function TourSettingsPage() {
  return (
    <div className="space-y-6 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-6 w-6 text-red-600" />
          Tour Settings
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Tabs defaultValue="tour-type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tour-type">Tour Type</TabsTrigger>
            <TabsTrigger value="tour-inclusions">Tour Inclusions</TabsTrigger>
            <TabsTrigger value="tour-exclusions">Tour Exclusions</TabsTrigger>
          </TabsList>

          <TabsContent value="tour-type" className="mt-6">
            <ManageTourTypes />
          </TabsContent>

          <TabsContent value="tour-inclusions" className="mt-6">
            <ManageTourInclusions />
          </TabsContent>

          <TabsContent value="tour-exclusions" className="mt-6">
            <ManageTourExclusions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
