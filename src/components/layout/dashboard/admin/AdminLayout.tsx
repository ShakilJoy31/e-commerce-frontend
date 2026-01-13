import AdminSidebarNavigationLargeDevice from "@/components/navigation/admin/AdminSidebarNavigationLargeDevice";
import AdminSidebarNavigationSmallDevice from "@/components/navigation/admin/AdminSidebarNavigationSmallDevice";
import AdminUpperNavigation from "@/components/navigation/admin/AdminUpperNavigation";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Large Device Sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile Sidebar
  return (
    <div className="flex flex-col bg-[#F5F6FA]">
      {/* Upper Navigation */}
      <div className="w-full">
        <AdminUpperNavigation
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Section */}
        <AdminSidebarNavigationLargeDevice
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminSidebarNavigationSmallDevice
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Page Content */}
        <main
          className={`flex-1 mt-20 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-[280px]" : "lg:ml-14"
          } p-6 bg-gray-100`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
