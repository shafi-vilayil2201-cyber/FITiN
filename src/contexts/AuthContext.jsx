import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }, [user]);
  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.id) return;
        const tryFetch = async (url) => {
          const res = await fetch(url);
          if (!res.ok) return null;
          return res.json();
        };

        let fresh = await tryFetch(`http://localhost:3000/users/${parsed.id}`);
        if (!fresh) fresh = await tryFetch(`http://localhost:3000/admins/${parsed.id}`);

        if (!fresh) {
          if (mounted) {
            setUser(null);
            toast.info('Session invalidated (user not found).');
          }
          return;
        }
        if (fresh.isBlock) {
          if (mounted) {
            setUser(null);
            try { localStorage.removeItem('currentUser'); } catch (e) {}
            toast.error('Your account has been blocked — you have been signed out.');
          }
          return;
        }
        const refreshedSafe = { ...fresh };
        if (refreshedSafe.password) delete refreshedSafe.password;
        if (mounted) setUser(refreshedSafe);
      } catch (err) {
        console.error('Error validating persisted session:', err);
      }
    };

    validate();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (u) => setUser(u);
  const logout = () => {
    try { localStorage.removeItem('currentUser'); } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}