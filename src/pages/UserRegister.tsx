
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SinglePageUserRegistrationForm from '@/components/auth/SinglePageUserRegistrationForm';
import { toast } from 'sonner';

const UserRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    toast.success('Registration successful! Please check your email to verify your account.');
    navigate('/login');
  };

  const handleRegistrationError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <Navbar />
      <main className="flex-1 py-8 container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Join iFindLife</h1>
            <p className="text-muted-foreground">
              Connect with expert therapists and wellness professionals
            </p>
            <p className="mt-2">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Login here</Link>
            </p>
          </div>
          
          <SinglePageUserRegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onError={handleRegistrationError}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserRegister;
