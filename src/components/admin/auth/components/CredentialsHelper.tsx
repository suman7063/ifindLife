
import React from 'react';
import { testCredentials } from '@/contexts/admin-auth/constants';

const CredentialsHelper: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground mt-2">
      <p>Admin credentials:</p>
      <p>- Username: <strong>{testCredentials.iflsuperadmin.username}</strong>, Password: <strong>{testCredentials.iflsuperadmin.password}</strong></p>
    </div>
  );
};

export default CredentialsHelper;
