
import React from 'react';
import { Lock, Shield } from 'lucide-react';

interface AuthProtectionIndicatorProps {
  isAuthProtected: boolean;
  serviceTitle: string;
}

const AuthProtectionIndicator: React.FC<AuthProtectionIndicatorProps> = ({
  isAuthProtected,
  serviceTitle
}) => {
  if (!isAuthProtected) return null;

  return (
    <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg mb-4">
      <Lock className="h-5 w-5 text-green-600" />
      <div>
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Secure Session Active
        </p>
        <p className="text-xs text-green-600 dark:text-green-300">
          Your authentication is protected during this expert selection
        </p>
      </div>
    </div>
  );
};

export default AuthProtectionIndicator;
