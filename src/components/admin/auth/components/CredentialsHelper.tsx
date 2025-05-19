
import React from 'react';
import { testCredentials } from '@/contexts/admin-auth/constants';

const CredentialsHelper: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground mt-2">
      <p>For testing, try these credentials:</p>
      <p>- Username: <strong>{testCredentials.admin.username}</strong>, Password: <strong>{testCredentials.admin.password}</strong></p>
      <p>- Username: <strong>{testCredentials.superadmin.username}</strong>, Password: <strong>{testCredentials.superadmin.password}</strong></p>
      <p>- Username: <strong>{testCredentials.iflsuperadmin.username}</strong>, Password: <strong>{testCredentials.iflsuperadmin.password}</strong></p>
    </div>
  );
};

export default CredentialsHelper;
