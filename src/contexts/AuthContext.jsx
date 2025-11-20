// src/contexts/AuthContext.jsx
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

  // --- CHANGED AREA: Validate persisted session on mount against server state ---
  // This prevents a blocked user from remaining logged-in in the client when admin blocks them.
  useEffect(() => {
    let mounted = true;
    const validate = async () => {
      try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.id) return;

        // Try to fetch authoritative user record from /users/:id
        // If not found, try /admins/:id
        const tryFetch = async (url) => {
          const res = await fetch(url);
          if (!res.ok) return null;
          return res.json();
        };

        let fresh = await tryFetch(`http://localhost:3000/users/${parsed.id}`);
        if (!fresh) fresh = await tryFetch(`http://localhost:3000/admins/${parsed.id}`);

        if (!fresh) {
          // If server has no user record, sign out for safety
          if (mounted) {
            setUser(null);
            toast.info('Session invalidated (user not found).');
          }
          return;
        }

        // If server says user is blocked, logout immediately
        if (fresh.isBlock) {
          if (mounted) {
            setUser(null);
            try { localStorage.removeItem('currentUser'); } catch (e) {}
            toast.error('Your account has been blocked — you have been signed out.');
          }
          return;
        }

        // Otherwise refresh local user with authoritative data (do not include password in memory if present)
        const refreshedSafe = { ...fresh };
        if (refreshedSafe.password) delete refreshedSafe.password;
        if (mounted) setUser(refreshedSafe);
      } catch (err) {
        // network or parse errors are safe to ignore here; keep client session as-is
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