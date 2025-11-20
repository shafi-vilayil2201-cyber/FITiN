import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminNavbar from "../common/adminNavbar";


import { FaHome, FaBoxOpen, FaShoppingCart, FaBars, FaTimes,FaUser } from "react-icons/fa";

export default function AdminLayout() {
  const { currentUser } = useAdminAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaHome className="w-5 h-5" /> },
    { to: "/admin/products", label: "Products", icon: <FaBoxOpen className="w-5 h-5" /> },
    { to: "/admin/orders", label: "Orders", icon: <FaShoppingCart className="w-5 h-5" /> },
    { to: "/admin/users", label: "Users", icon: <FaUser className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="relative z-30">
        <AdminNavbar />
      </div>
      <div className="flex flex-1">
        <aside
          className="hidden md:flex md:flex-col fixed top-0 left-0 h-screen w-72 p-6
                     bg-linear-to-b from-emerald-200 via-emerald-100 to-emerald-50
                     border-r border-transparent shadow-inner rounded-tr-2xl z-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div>
              <img 
              className="w-15 h-15 rounded-full flex items-center justify-center object-fill hover:animate-pulse"
              src={currentUser.img} alt="profile" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800"></div>
              <div className="text-lg text-slate-500">{currentUser?.name || currentUser?.email}</div>
            </div>
          </div>
        
          <nav className="flex-1 space-y-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-xl transition text-sm font-medium ${
                    isActive
                      ? "bg-linear-to-r from-emerald-400 to-emerald-150 text-emerald-800 shadow-xl ring-1 ring-emerald-100"
                      : "text-slate-700 hover:bg-white/50"
                  }`
                }
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/70">
                  {n.icon}
                </div>
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>

  
          <footer className="mt-6 text-xs text-slate-500 ">
            <div>Version 1.0</div>
            <div className="mt-2">© FITiN</div>
          </footer>
        </aside>
        <div className={`md:hidden fixed inset-0 z-40 ${open ? "block" : "hidden"}`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 top-0 bottom-0 w-72 p-6 bg-linear-to-b from-emerald-100 to-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-emerald-600 font-bold">
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-800">FITiN Admin</div>
                  <div className="text-sm text-slate-500">{currentUser?.name || currentUser?.email}</div>
                </div>
              </div>

              <button onClick={() => setOpen(false)} className="text-slate-600">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-white/50"
                    }`
                  }
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/70">{n.icon}</div>
                  <span>{n.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <main className="flex-1 ml-0 md:ml-72 pt-17 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOpen(true)}
                  className="md:hidden p-5 rounded-lg bg-white border border-slate-200 shadow-sm"
                >
                  <FaBars className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              <div className="hidden md:flex items-center gap-3">
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-12">
                <div className="bg-white/80 rounded-2xl p-4 shadow-[0_6px_20px_rgba(99,102,241,0.06)] border border-transparent">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}