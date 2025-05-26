
import React from 'react';
import NewNavbar from '@/components/NewNavbar';
import Footer from '@/components/Footer';

const LoadingView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewNavbar />
      <main className="flex-1 flex items-center justify-center bg-stars">
        <div className="flex flex-col items-center">
          <div className="relative flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ifind-teal"></div>
            <div className="animate-pulse absolute">
              <div className="h-10 w-10 bg-ifind-teal/30 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingView;
