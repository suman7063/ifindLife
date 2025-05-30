
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminExperts from '@/components/admin/AdminExperts';
import AdminServices from '@/components/admin/AdminServices';
import AdminPrograms from '@/components/admin/AdminPrograms';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminBlog from '@/components/admin/AdminBlog';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/experts" element={<AdminExperts />} />
          <Route path="/services" element={<AdminServices />} />
          <Route path="/programs" element={<AdminPrograms />} />
          <Route path="/testimonials" element={<AdminTestimonials />} />
          <Route path="/blog" element={<AdminBlog />} />
        </Routes>
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default Admin;
