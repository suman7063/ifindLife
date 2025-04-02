
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ExpertRegister: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-center mb-6">Expert Registration</h1>
              <p className="text-center mb-4">
                Already have an expert account? <Link to="/expert-login" className="text-ifind-teal hover:underline">Login</Link>
              </p>
              <p className="text-center text-gray-600 mb-6">
                Complete the form below to register as an expert.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertRegister;
