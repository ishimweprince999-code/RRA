import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import { useState } from "react";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar
        items={[
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/hierarchy", label: "Admin Hierarchy" },
          { to: "/admin/traders", label: "Traders" },
          { to: "/admin/taxes", label: "Taxes Overview" },
          { to: "/admin/analytics", label: "Analytics" },
          { to: "/admin/notifications", label: "Notifications" },
          { to: "/admin/system-health", label: "System Health" },
          { to: "/admin/profile", label: "Profile" },
          { to: "/admin/settings", label: "Settings" },
        ]}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      {/* Main content with margin for fixed sidebar - Enhanced for tablets */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="p-4 sm:p-5 md:p-6 lg:p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
