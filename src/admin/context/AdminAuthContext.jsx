import React, { createContext, useContext, useEffect, useState } from 'react';

const AdminAuthContext = createContext();

export function useAdminAuth() { return useContext(AdminAuthContext); }

export function AdminAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentAdmin');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentAdmin', JSON.stringify(currentUser));
    else localStorage.removeItem('currentAdmin');
  }, [currentUser]);

  const login = (userObj) => setCurrentUser(userObj);

  const logout = () => {
    try { localStorage.removeItem('currentAdmin'); } catch (e) { }
    setCurrentUser(null);
  };

  const isAdmin = !!(currentUser && (currentUser.role === 'admin' || currentUser.isAdmin));

  return (
    <AdminAuthContext.Provider value={{ currentUser, login, logout, isAdmin, loading, setLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}