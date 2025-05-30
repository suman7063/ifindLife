
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/admin-auth/AdminAuthProvider';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import AdminUsersManager from '@/components/admin/users/AdminUsersManager';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import { ServicesEditor } from '@/components/admin/services';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';

const Admin = () => {
  return (
    <AdminAuthProvider>
      <AdminDashboardLayout activeTab="overview" setActiveTab={() => {}}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsersManager />} />
          <Route path="/experts" element={<ExpertsEditor experts={[]} setExperts={() => {}} loading={false} error={null} onRefresh={() => {}} />} />
          <Route path="/services" element={<ServicesEditor categories={[]} setCategories={() => {}} loading={false} error={null} onRefresh={() => {}} />} />
          <Route path="/programs" element={<ProgramsEditor />} />
          <Route path="/testimonials" element={<TestimonialsEditor testimonials={[]} setTestimonials={() => {}} />} />
          <Route path="/blog" element={<BlogEditor />} />
        </Routes>
      </AdminDashboardLayout>
    </AdminAuthProvider>
  );
};

export default Admin;
