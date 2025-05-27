
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

interface RegisterTabProps {
  onSwitchToLogin?: () => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => {
    setLoading(true);
    try {
      const success = await signup(userData.email, userData.password, userData, userData.referralCode);
      if (success) {
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <RegisterForm onRegister={handleRegister} loading={loading} />
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
