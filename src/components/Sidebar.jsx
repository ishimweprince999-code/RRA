import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, FileText, BarChart3, Users, DollarSign, TrendingUp, ChevronLeft, ChevronRight, User, LogOut, Menu, X, Shield, MapPin } from "lucide-react";
import useAuth from "../store/auth.js";

const iconMap = {
  "Dashboard": LayoutDashboard,
  "New Sale": Plus,
  "Transactions": FileText,
  "Reports": BarChart3,
  "Traders": Users,
  "Taxes Overview": DollarSign,
  "Analytics": TrendingUp,
  "Admin Hierarchy": Shield,
  "Hierarchy": MapPin,
};

export default function Sidebar({ items = [], mobileOpen = false, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl transition-all duration-300 z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
      {/* Logo Section - Enhanced */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-transparent">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-yellow-400 flex items-center justify-center shadow-xl transform hover:scale-105 transition-all">
                  <span className="text-white font-black text-lg">ST</span>
                </div>
                {/* Rwanda flag indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 flex gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                  <div className="w-1 h-1 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div>
                <h1 className="font-black text-white text-base tracking-tight">SmartTax</h1>
                <p className="text-xs text-blue-400 capitalize font-semibold">{role} Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-700/20 hover:from-slate-600/50 hover:to-slate-700/30 text-slate-300 hover:text-white transition-all hover:scale-105 ml-auto shadow-md"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((i) => {
          const Icon = iconMap[i.label] || LayoutDashboard;
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105"
                    : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-700/30 hover:text-white hover:translate-x-2 hover:shadow-lg"
                }`
              }
              title={collapsed ? i.label : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm tracking-wide">{i.label}</span>
              )}
              {/* Active indicator - Rwanda colors */}
              <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-yellow-400 to-green-500 opacity-0 group-[.active]:opacity-100 transition-opacity rounded-l-full" />
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-700/50">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-700/40 to-slate-700/20 border border-slate-600/30 hover:border-slate-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-xl">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{user?.name || "User"}</div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50 transition-all hover:shadow-lg hover:scale-105"
            >
              <LogOut size={18} />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto w-fit">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-xl">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse"></div>
            </div>
            <button
              onClick={logout}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 hover:text-red-300 border border-red-600/30 transition-all flex items-center justify-center hover:scale-105"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>

    {/* Mobile Sidebar Overlay */}
    {mobileOpen && (
      <div 
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setMobileOpen?.(false)}
      />
    )}

    {/* Mobile Sidebar */}
    <aside 
      className={`md:hidden flex flex-col fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl transition-transform duration-300 z-50 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Mobile Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-yellow-400 flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-lg">ST</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 flex gap-0.5">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-tight">SmartTax</h1>
              <p className="text-xs text-blue-400 capitalize font-semibold">{role} Portal</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen?.(false)}
            className="p-2 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((i) => {
          const Icon = iconMap[i.label] || LayoutDashboard;
          return (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => setMobileOpen?.(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30"
                    : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-700/30 hover:text-white"
                }`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm tracking-wide">{i.label}</span>
              <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-yellow-400 to-green-500 opacity-0 group-[.active]:opacity-100 transition-opacity rounded-l-full" />
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile User Section */}
      <div className="p-3 border-t border-slate-700/50">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-700/40 to-slate-700/20 border border-slate-600/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name || "User"}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
