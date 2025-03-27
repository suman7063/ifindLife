
import React from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DashboardLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-ifind-aqua" />
          <h2 className="text-2xl font-semibold">Loading your dashboard...</h2>
          <p className="text-gray-500">Please wait while we fetch your information</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLoader;
