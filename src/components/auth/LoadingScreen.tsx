
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 container">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingScreen;
