
import React from 'react';
import AdminLoginHeader from './AdminLoginHeader';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginContentProps {
  onLoginSuccess: () => void;
}

const AdminLoginContent: React.FC<AdminLoginContentProps> = ({ onLoginSuccess }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <AdminLoginHeader />
      <AdminLoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default AdminLoginContent;
