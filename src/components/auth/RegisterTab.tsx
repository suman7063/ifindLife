
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

interface RegisterTabProps {
  onSwitchToLogin?: () => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({ onSwitchToLogin }) => {
  return (
    <div className="space-y-4">
      <RegisterForm />
      {onSwitchToLogin && (
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-muted-foreground hover:text-primary underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterTab;
