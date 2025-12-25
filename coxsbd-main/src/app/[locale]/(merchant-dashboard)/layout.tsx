"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/user-account/Sidebar";
import { TopNav } from "@/components/user-account/top-nav";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SidebarProvider>
          <Sidebar
            setMobileOpen={setMobileOpen}
            mobileOpen={mobileOpen}
            panelTitle={"Merchant Panel"}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <TopNav setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />

            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
