
import React from "react";
import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const { currentUser, logout: adminLogout } = useAdminAuth();
  const { logout: appLogout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('currentUser'); } catch (e) {}
    if (adminLogout) adminLogout();
    if (appLogout) appLogout();
    navigate('/login');
  };

  return (
    <>
    <div className="w-full flex justify-center sm:justify-end pt-3 pr-0 sm:pr-6 fixed">
    <header className={`w-280 bg-white ${scrolled ? "backdrop-blur-xl bg-white/70 shadow-lg" : "shadow-xl"} border-b border-slate-200 px-6 py-3 flex items-center justify-between rounded-2xl transition-all duration-300 `}>
      <div className="text-2xl font-bold text-emerald-600 tracking-wide">FITiN</div>
      <div className="flex items-center gap-4">
        <div className="">
          <img 
              className="w-12 h-12 rounded-full flex items-center justify-center object-fill hover:animate-pulse"
              src={currentUser.img} alt="" />
        </div>
        {/* <span className="text-slate-700 font-medium hidden sm:block">{currentUser?.name || currentUser?.email}</span> */}
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm">Logout</button>
      </div>
    </header>
    </div>
    </>
  );
}