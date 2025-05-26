
import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const UserRegister: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 py-16 container">
        <div className="max-w-md mx-auto">
          <Card className="border-ifind-lavender/20 shadow-xl">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
              <p className="text-center mb-4">
                Already have an account? <Link to="/login" className="text-ifind-teal hover:underline">Login</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserRegister;
