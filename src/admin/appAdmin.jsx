import React from 'react';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminRouter from './routers/adminRouter';

export default function AppAdmin() {
  return (
    <AdminAuthProvider>
      <AdminRouter />
    </AdminAuthProvider>
  );
}

