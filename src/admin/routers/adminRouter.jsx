import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminLayout from '../Layout/adminLayout';
import Dashboard from '../dashboard/dashboard';
import Orders from '../orders/orders';
import Products from '../products/products';
import Users from '../users/users';

export default function AdminRouter() {
  const { isAdmin } = useAdminAuth();

  return (
    <Routes>
      <Route
        path="/admin/login"
        element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/admin/*"
        element={isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users/>}/>
      </Route>

      <Route path="/admin" element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}