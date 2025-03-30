
import React from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LoadingView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 flex items-center justify-center bg-stars">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-ifind-aqua" />
          <h2 className="text-xl font-medium">Loading Expert Data...</h2>
          <p className="text-muted-foreground">Please wait while we retrieve your information</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingView;
