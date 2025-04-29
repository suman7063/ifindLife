
import React from 'react';
import AdminLoginHeader from './AdminLoginHeader';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginContentProps {
  onLoginSuccess: () => void;
}

const AdminLoginContent: React.FC<AdminLoginContentProps> = ({ onLoginSuccess }) => {
  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-ifind-teal/10">
      <AdminLoginHeader />
      <AdminLoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default AdminLoginContent;
