import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This component is no longer used in the admin dashboard layout
// But we keep it for backward compatibility with other parts of the app
interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  // This component is kept only for backward compatibility
  // It's not rendered in the current admin dashboard
  return null;
};

export default AdminHeader;
